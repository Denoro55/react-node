const {Router} = require('express');
const router = Router();
const authMiddleware = require('../../middleware/auth');

const mongoose = require('mongoose');
const User = require('../../models/User');
const Chat = require('../../models/Chat');
const Message = require('../../models/Message');
const ObjectId = mongoose.Types.ObjectId;

router.post('/sendMessage', authMiddleware, async (req, res) => {
    const {id, senderId, message, date} = req.body;

    const senderUser = await User.findOne({_id: senderId});
    const receiverUser = await User.findOne({_id: id});

    // create companion chat if does not
    const chat = await Chat.findOne({from: id, to: senderId});
    if (!chat) {
        const newChat = new Chat({from: id, to: senderId, date: -1});
        await newChat.save();
    }

    // // // update chat last time watching
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
});

router.post('/listMessages', async (req, res) => {
    const {id} = req.body;

    // const messages = await Message
    //     .find({from: id})
    //     .populate('from', 'name');

    // await Message.remove({});
    // await Chat.remove({});

    console.log('messages of ', id);

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
                }
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
        },
        {
            $lookup: {
                from: "chats",
                pipeline: [
                    {
                        $match: {
                            from: ObjectId(id),
                            to: ObjectId.valueOf("$_id")
                        }
                    }
                ],
                as: "chat"
            }
        },
        {
            $project: {
                chat: {
                    $filter: {
                        input: "$chat",
                        as: "item",
                        cond: { $eq: [ "$$item.to", "$_id" ] }
                    }
                },
                user: 1,
                from: 1,
                to: 1,
                text: 1,
                date: 1
            }
        }
    ]);

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

    // const chats = await Chat.aggregate([
    //     {
    //         $match: {
    //             $or: [
    //                 {from: ObjectId(id)},
    //                 {to: ObjectId(id)},
    //             ]
    //         }
    //     },
    //     {
    //         $addFields: {
    //             roomId: {
    //                 $cond: { if: { $eq: [ "$from", ObjectId(id) ] }, then: "$to", else: "$from" }
    //             },
    //         }
    //     },
    //     {
    //         $sort: {
    //             date: 1
    //         }
    //     },
    //     {
    //         $group: {
    //             _id: "$roomId",
    //             date: {$last: "$date"},
    //             from: {$last: "$from"}
    //         }
    //     },
    //     {
    //         $sort: {
    //             date: -1
    //         }
    //     },
    // ]);

    console.log('chats: ', chats);
    console.log('messages: ', messages);

    const preparedMessages = messages.map((m, idx) => {
        const chat = m.chat[0];
        console.log(chat);
        const isUpdated = m.from.toString() !== id.toString() && chat.date < m.date;
        // const isUpdated = chat.date < m.date && chat.from.toString() !== m.from.toString();
        // const isUpdated = chat.from.toString() !== id.toString() && chat.date < m.date;
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

module.exports = router;
