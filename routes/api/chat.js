const {Router} = require('express');
const router = Router();

const mongoose = require('mongoose');
const User = require('../../models/User');
const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const ObjectId = mongoose.Types.ObjectId;

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
    const {id: senderId, receiverId: id, date} = req.body;

    // update chat last time watching
    const chat = await Chat.findOne({from: senderId, to: id});
    if (chat) {
        await chat.updateOne({from: senderId, to: id, date});
    } else {
        const newChat = new Chat({from: senderId, to: id, date});
        await newChat.save();
    }

    res.json({success: true});
});

module.exports = router;
