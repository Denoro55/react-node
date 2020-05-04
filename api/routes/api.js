const {Router} = require('express');
const router = Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const authMiddleware = require('../middleware/auth');
const { validationResult } = require('express-validator');
const { RegisterValidator, LoginValidator } = require('../validators');

const mongoose = require('mongoose');
const User = require('../models/User');
const Chat = require('../models/Chat');
const Message = require('../models/Message');
const ObjectId = mongoose.Types.ObjectId;

const longpoll = require('express-longpoll')(router);
longpoll.create('/longpoll', function (req,res,next) {
    req.id = req.query.id;
    console.log('Longpool GET with id', req.id);
    next();
});

router.get('/foo', (req, res) => {
    res.json({a: 1})
});

router.post('/auth', (req, res) => {
    console.log(req.session);
    const auth = req.session.auth || false;
    res.json({auth});
});

router.post('/login', LoginValidator, async (req, res) => {
    const {email, password} = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsArray = errors.array();
        return res.status(422).json({ errors: errorsArray, message: errorsArray[0].msg });
    }

    const user = await User.findOne({email});
    if (!user) {
        return res.status(400).json({errors: [], message: 'Email does not exist'});
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (checkPassword) {
        const token = jwt.sign(
            {userId: user.id},
            config.get('jwtSecret'),
            {expiresIn: '1h'}
        );
        return res.json({token});
    } else {
        return res.status(400).json({errors: [], message: 'Passwords are not identical'});
    }
});

router.post('/register', RegisterValidator, async (req, res) => {
    const {name, email, password} = req.body;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errorsArray = errors.array();
        return res.status(422).json({ errors: errorsArray, message: errorsArray[0].msg });
    }

    const user = await User.findOne({email});

    if (user) {
        return res.status(400).json({ errors: [], message: 'Email is already exists'});
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const newUser = new User({
        name, email, password: hashPassword
    });

    await newUser.save();

    res.status(201).json({message: 'You have successfully registered!'});
});

router.post('/userData', authMiddleware, async (req, res) => {
    const user = await User.findOne({_id: req.user.userId});
    const data = {
        name: user.name,
        id: user._id
    };
    return res.json({data});
});

router.post('/sendMessage', authMiddleware, async (req, res) => {
    const {id, senderId, message} = req.body;

    const senderUser = await User.findOne({_id: senderId});
    const receiverUser = await User.findOne({_id: id});

    // update chat last time watching
    const chat = await Chat.findOne({from: senderId, to: id});
    if (chat) {
        await chat.update({from: senderId, to: id, date: Date.now()});
    } else {
        const newChat = new Chat({from: senderId, to: id, date: Date.now()});
        await newChat.save();
    }

    const newMessage = new Message({
        name: senderUser,
        text: message.text,
        from: senderUser,
        to: receiverUser,
        date: Date.now()
    });
    await newMessage.save();

    longpoll.publishToId('/longpoll', id, {id, senderId, message});

    res.json({success: true});
});

router.post('/listMessages', async (req, res) => {
    const {id} = req.body;

    // const messages = await Message
    //     .find({from: id})
    //     .populate('from', 'name');

    // await Message.remove({});
    // await Chat.remove({});

    const messages = await Message.aggregate([
        {
            $group: {
                _id: {to: "$to", from: "$from"},
                from: {$last: "$from"},
                to: {$last: "$to"},
                text: {$last: "$text"},
                date: {$last: "$date"}
            }
        },
        {
            $match: {
                $or: [
                    {from: ObjectId(id)},
                    {to: ObjectId(id)}
                ]
            }
        },
        {
            $addFields: {
                roomId: {
                    $cond: { if: { $eq: [ "$from", ObjectId(id) ] }, then: "$to", else: "$from" }
                },
            }
        },
        {
            $sort: {
                date: 1
            }
        },
        {
            $group: {
                _id: "$roomId",
                from: {$last: "$from"},
                to: {$last: "$to"},
                text: {$last: "$text"},
                date: {$last: "$date"}
            }
        },
        {
            $sort: {
                date: -1
            }
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "user"
            }
        }
    ]);

    const chats = await Chat.aggregate([
        {
            $match: {
                $or: [
                    {from: ObjectId(id)},
                    {to: ObjectId(id)},
                ]
            }
        },
        {
            $addFields: {
                roomId: {
                    $cond: { if: { $eq: [ "$from", ObjectId(id) ] }, then: "$to", else: "$from" }
                },
            }
        },
        {
            $sort: {
                date: 1
            }
        },
        {
            $group: {
                _id: "$roomId",
                date: {$last: "$date"},
                from: {$last: "$from"}
            }
        },
        {
            $sort: {
                date: -1
            }
        },
    ]);

    console.log(messages);

    // console.log('chats: ', chats);
    // console.log('messages: ', messages);

    const preparedMessages = messages.map((m, idx) => {
        const chat = chats[idx];
        const isUpdated = chat.from.toString() !== id.toString() && chat.date < m.date;
        return {
            name: m.user[0].name,
            text: m.text,
            updated: isUpdated,
            id: m._id
        }
    });

    // console.log('prepared', preparedMessages);

    res.json({messages: preparedMessages});
});

router.post('/chatMessages', async (req, res) => {
    const {id: senderId, receiverId: id} = req.body;

    // console.log('from', senderId, 'to', id);

    const messages = await Message
        .find({$or: [{from: senderId, to: id}, {from: id, to: senderId}]})
        .populate('from', 'name');

    const companion = await User.findOne({_id: ObjectId(id)});

    // update chat last time watching
    const chat = await Chat.findOne({from: senderId, to: id});
    if (chat) {
        await chat.updateOne({from: senderId, to: id, date: Date.now()});
    } else {
        const newChat = new Chat({from: senderId, to: id, date: Date.now()});
        await newChat.save();
    }

    const preparedMessages = messages.map(m => {
        return {
            name: m.from.name,
            text: m.text
        }
    });

    res.json({companion: {name: companion.name}, messages: preparedMessages});
});

router.post('/chat', async (req, res) => {
    const {id: senderId, receiverId: id} = req.body;

    // update chat last time watching
    const chat = await Chat.findOne({from: senderId, to: id});
    if (chat) {
        await chat.updateOne({from: senderId, to: id, date: Date.now()});
    } else {
        const newChat = new Chat({from: senderId, to: id, date: Date.now()});
        await newChat.save();
    }

    res.json({success: true});
});

setInterval(() => {
    longpoll.publish('/longpoll', {type: 'timeout'});
}, 8000);

module.exports = router;


