const {Router} = require('express');
const router = Router();
const authMiddleware = require('../../middleware/auth');

const mongoose = require('mongoose');
const Post = require('../../models/Post');
const User = require('../../models/User');
const ObjectId = mongoose.Types.ObjectId;

const fileMiddleware = require('../../middleware/file');

const timeSince = require('../../utils/timeSince');

router.post('/createPost', authMiddleware, fileMiddleware.single('image'), async (req, res) => {
    const user = await User.findOne({_id: req.body.id});
    let filename;

    if (req.file) {
        filename = req.file.filename;
    }

    const post = new Post({
        owner: user,
        text: req.body.text,
        imageUrl: filename,
        date: Date.now()
    });
    await post.save();

    const {_doc: {owner, ...rest}} = post;

    const preparedPost = {
        ...rest,
        user: {
            name: user.name
        },
        time: timeSince(post.date)
    };

    res.json({post: preparedPost});
});

router.post('/posts', authMiddleware, async (req, res) => {
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
                isLiked: { $in: [ ObjectId(user._id), '$likes' ] }
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

    res.json({ posts: preparedPosts })
});

router.delete('/posts', authMiddleware, async (req, res) => {
    const post = await Post.findOne({_id: req.body.id});
    await post.remove();

    res.json({ok: true});
});

router.post('/postLike', authMiddleware, async (req, res) => {
    if (!req.body.like) {
        // like
        await Post.findOneAndUpdate(
            {
                "_id": ObjectId(req.body.postId),
                "likes": { "$ne": ObjectId(req.body.userId) }
            },
            {
                "$inc": { "likeCount": 1 },
                "$push": { "likes": ObjectId(req.body.userId) }
            },
            {new: true}
        )
        .populate('owner', 'name')
        .exec(function(err, post) {
            if (err) throw err;

            if (!post) {
                return res.status(429).json({ok: false});
            }

            const data = {
                ...post._doc,
                isLiked: true,
                user: {
                    name: post.owner.name
                }
            };

            res.json({ok: true, post: data})
        })
    } else {
        // dislike
        await Post.findOneAndUpdate(
            {
                "_id": ObjectId(req.body.postId),
                "likes": ObjectId(req.body.userId)
            },
            {
                "$inc": { "likeCount": -1 },
                "$pull": { "likes": ObjectId(req.body.userId) }
            },
            {new: true}
        )
        .populate('owner', 'name')
        .exec(function(err, post) {
            if (err) throw err;

            if (!post) {
                return res.status(429).json({ok: false});
            }

            const data = {
                ...post._doc,
                isLiked: false,
                user: {
                    name: post.owner.name
                }
            };

            return res.json({ok: true, post: data})
        })
    }
});

module.exports = router;

