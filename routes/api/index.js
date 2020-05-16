const {Router} = require('express');
const router = Router();
const authMiddleware = require('../../middleware/auth');
const fileMiddleware = require('../../middleware/file');

const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const User = require('../../models/User');
const Post = require('../../models/Post');

const timeSince = require('../../utils/timeSince');

// routes
const authRoutes = require('./auth');
const postsRoutes = require('./posts');
const messagesRoutes = require('./messages');
const chatRoutes = require('./chat');

router.use('/', authRoutes);
router.use('/', postsRoutes);
router.use('/', messagesRoutes);
router.use('/', chatRoutes);

router.post('/userInfo', authMiddleware, async (req, res) => {
    const {id: userId, clientId} = req.body;

    try {
        const user = await User.findOne({_id: userId});

        const posts = await Post.aggregate([
            {
                $match: {
                    wallOwner: ObjectId(userId)
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
            { $limit : 10 },
            {
                $lookup: {
                    from: "users",
                    localField: "owner",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $lookup: {
                    "from": "comments",
                    "localField": "comments",
                    "foreignField": "_id",
                    "as": "comments"
                }},
            { $unwind: { path: "$comments", preserveNullAndEmptyArrays: true } },
            { $lookup: {
                    "from": "users",
                    "localField": "comments.userId",
                    "foreignField": "_id",
                    "as": "commentUser"
                }},
            {
                $group: {
                    _id: "$_id",
                    date: { $last: "$date" },
                    comments: {
                        $push: {
                            $cond: { if: { $ne: [ "$commentUser", [] ] },
                                then: {
                                    user: "$commentUser",
                                    body: '$comments'
                                },
                                else: "$$REMOVE" }
                        }
                    },
                    commentsCount: { $last: "$commentsCount" },
                    likesCount: { $last: "$likesCount" },
                    likes: { $last: "$likes" },
                    imageUrl: { $last: "$imageUrl" },
                    owner: { $last: "$owner" },
                    text: { $last: "$text" },
                    time: { $last: "$time" },
                    user: { $last: "$user" },
                }
            },
            {
                $sort: {
                    date: -1
                }
            },
            {
                $addFields: {
                    isLiked: { $in: [ ObjectId(clientId), '$likes' ] }
                }
            },
            { $project: { likes: 0 } }
        ]);

        const preparedPosts = posts.map(post => {
            const comments = post.comments.map(c => {
                const {name, avatarUrl} = c.user[0];

                return {
                    ...c.body,
                    time: timeSince(new Date(c.body.date)),
                    user: { name, avatarUrl }
                }
            });

            return {
                ...post,
                comments,
                user: {
                    name: post.user[0].name
                },
                time: timeSince(new Date(post.date))
            }
        });

        // const posts = await Post.aggregate([
        //     {
        //         $match: {
        //             owner: user._id
        //         }
        //     },
        //     {
        //         $sort: {
        //             date: -1
        //         }
        //     },
        //     {
        //         $lookup: {
        //             from: "users",
        //             localField: "owner",
        //             foreignField: "_id",
        //             as: "user"
        //         }
        //     },
        //     { $limit : 10 },
        //     {
        //         $addFields: {
        //             isLiked: { $in: [ ObjectId(req.body.clientId), '$likes' ] }
        //         }
        //     }
        // ]);
        //
        // const preparedPosts = posts.map(post => {
        //     return {
        //         ...post,
        //         user: {
        //             name: post.user[0].name
        //         },
        //         time: timeSince(new Date(post.date))
        //     }
        // });

        const data = {
            name: user.name,
            id: user._id,
            avatarUrl: user.avatarUrl,
            posts: preparedPosts
        };

        return res.json({data});

    } catch (e) {
        console.log(e);
        res.status(404).json({ok: false})
    }
});


router.post('/uploadAvatar', authMiddleware, fileMiddleware.single('avatar'), async (req, res) => {
    console.log('file is ', req.file);
    const filename = req.file.filename;

    const user = await User.findOne({_id: req.body.id});
    await user.updateOne({avatarUrl: filename});

    res.json({avatarUrl: filename});
});

module.exports = router;
