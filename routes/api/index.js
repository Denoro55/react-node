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
    try {
        const user = await User.findOne({_id: req.body.id});

        const posts = await Post.aggregate([
            {
                $match: {
                    owner: user._id
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
                    localField: "owner",
                    foreignField: "_id",
                    as: "user"
                }
            },
            { $limit : 10 },
            {
                $addFields: {
                    isLiked: { $in: [ ObjectId(req.body.clientId), '$likes' ] }
                }
            }
        ]);

        const preparedPosts = posts.map(post => {
            return {
                ...post,
                user: {
                    name: post.user[0].name
                },
                time: timeSince(new Date(post.date))
            }
        });

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
