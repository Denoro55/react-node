const {Router} = require('express');
const router = Router();
const authMiddleware = require('../../middleware/auth');
const fileMiddleware = require('../../middleware/file');

const mongoose = require('mongoose');
const User = require('../../models/User');
const Post = require('../../models/Post');
const ObjectId = mongoose.Types.ObjectId;

// utils
const {postsAggregations} = require('../../utils/aggregations');
const preparePosts = require('../../utils/preparePosts');

router.post('/userInfo', authMiddleware, async (req, res) => {
    const {id: userId, clientId} = req.body;

    try {
        const users = await User.aggregate([
            {
                $match: {
                    _id: ObjectId(userId)
                }
            },
            {
                $addFields: {
                    isFollowing: { $in: [ ObjectId(clientId), '$followers' ] }
                }
            }
        ]);

        const user = users[0];

        const posts = await Post.aggregate(postsAggregations(userId, clientId));
        const preparedPosts = preparePosts(posts);

        const data = {
            name: user.name,
            id: user._id,
            avatarUrl: user.avatarUrl,
            isFollowing: user.isFollowing,
            followersCount: user.followers.length || 0,
            followingCount: user.following.length || 0,
            posts: preparedPosts
        };

        return res.json({data});

    } catch (e) {
        console.log(e);
        res.status(404).json({ok: false})
    }
});

router.post('/follow', authMiddleware, async (req, res) => {
    const {followerId, followingId, isFollowing} = req.body;

    let response = {
        user: {
            followersCount: 0,
            followingCount: 0
        },
        client: {
            followersCount: 0,
            followingCount: 0
        }
    };

    if (!isFollowing) {
        const client = await User.findOneAndUpdate(
            {
                _id: ObjectId(followerId),
                following: { "$ne": ObjectId(followingId) }
            },
            {
                "$push": { "following": ObjectId(followingId) }
            },
            {
                new: true
            }
        );

        response.client.followersCount = client.followers.length;
        response.client.followingCount = client.following.length;

        const user = await User.findOneAndUpdate(
            {
                _id: ObjectId(followingId),
                followers: { "$ne": ObjectId(followerId) }
            },
            {
                "$push": { "followers": ObjectId(followerId) }
            },
            {
                new: true
            }
        );

        response.user.followersCount = user.followers.length;
        response.user.followingCount = user.following.length;
    } else {
        const client = await User.findOneAndUpdate(
            {
                _id: ObjectId(followerId),
                following: ObjectId(followingId)
            },
            {
                "$pull": { "following": ObjectId(followingId) }
            },
            {
                new: true
            }
        );

        response.client.followersCount = client.followers.length;
        response.client.followingCount = client.following.length;

        const user = await User.findOneAndUpdate(
            {
                _id: ObjectId(followingId),
                followers: ObjectId(followerId)
            },
            {
                "$pull": { "followers": ObjectId(followerId) }
            },
            {
                new: true
            }
        );

        response.user.followersCount = user.followers.length;
        response.user.followingCount = user.following.length;
    }

    res.json({ ok: true, isFollowing: !isFollowing, ...response });
});

router.post('/uploadAvatar', authMiddleware, fileMiddleware.single('avatar'), async (req, res) => {
    console.log('file is ', req.file);
    const filename = req.file.filename;

    const user = await User.findOne({_id: req.body.id});
    await user.updateOne({avatarUrl: filename});

    res.json({avatarUrl: filename});
});

module.exports = router;
