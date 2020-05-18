const {Router} = require('express');
const router = Router();
const authMiddleware = require('../../middleware/auth');

const mongoose = require('mongoose');
const User = require('../../models/User');
const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const ObjectId = mongoose.Types.ObjectId;

const {messagesAggregation} = require('../../utils/aggregations');

router.post('/sendMessage', authMiddleware, async (req, res) => {
    const {id, senderId, message, date} = req.body;

    try {
        if (req.user.userId.toString() !== senderId.toString()) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        const senderUser = await User.findOne({_id: senderId});
        const receiverUser = await User.findOne({_id: id});

        // create companion chat if does not
        const chat = await Chat.findOne({from: id, to: senderId});
        if (!chat) {
            const newChat = new Chat({from: id, to: senderId, date: -1});
            await newChat.save();
        }

        // update chat last time watching
        // const chat = await Chat.findOne({from: senderId, to: id});
        // if (chat) {
        //     await chat.update({from: senderId, to: id, date});
        // } else {
        //     const newChat = new Chat({from: senderId, to: id, date});
        //     await newChat.save();
        // }

        const newMessage = new Message({
            name: senderUser,
            text: message.text,
            from: senderUser,
            to: receiverUser,
            date
        });
        await newMessage.save();

        res.json({success: true});
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/listMessages', async (req, res) => {
    const {id} = req.body;

    // const messages = await Message
    //     .find({from: id})
    //     .populate('from', 'name');

    // await Message.remove({});
    // await Chat.remove({});

    console.log('messages of ', id);

    try {
        const messages = await Message.aggregate(messagesAggregation(id));

        const chats = await Chat.aggregate([
            {
                $match: {
                    from: ObjectId(id)
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
        ]);

        console.log('chats: ', chats);
        console.log('messages: ', messages);

        const preparedMessages = messages.map((m, idx) => {
            const chat = m.chat[0];
            const user = m.user[0];
            const isUpdated = m.from.toString() !== id.toString() && chat.date < m.date;

            return {
                name: user.name,
                text: m.text,
                updated: isUpdated,
                id: m._id,
                avatarUrl: user.avatarUrl
            }
        });

        res.json({messages: preparedMessages});
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
});

module.exports = router;
