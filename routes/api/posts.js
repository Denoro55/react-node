const {Router} = require('express');
const router = Router();
const authMiddleware = require('../../middleware/auth');

const mongoose = require('mongoose');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const ObjectId = mongoose.Types.ObjectId;

const {postsAggregations} = require('../../utils/aggregations');

const fileMiddleware = require('../../middleware/file');

const timeSince = require('../../utils/timeSince');
const prepareComments = require('../../utils/prepareComments');
const preparePosts = require('../../utils/preparePosts');

router.post('/createPost', authMiddleware, fileMiddleware.single('image'), async (req, res) => {
    const {id, wallId, text} = req.body;

    try {
        if (req.user.userId.toString() !== id.toString()) {
            return res.status(401).json({message: 'Unauthorized'});
        }

        let filename;
        const user = await User.findOne({_id: id});
        const wallOwner = await User.findOne({_id: wallId});

        if (req.file) {
            filename = req.file.filename;
        }

        const post = new Post({
            wallOwner: ObjectId(wallId),
            owner: id,
            text: text,
            imageUrl: filename,
            date: Date.now()
        });

        await post.save();

        await wallOwner.updateOne({
            "$push": { "posts": ObjectId(post._id) }
        });

        const {_doc: {owner, ...rest}} = post;

        const preparedPost = {
            ...rest,
            user: {
                name: user.name
            },
            time: timeSince(post.date)
        };

        const posts = await Post.aggregate(postsAggregations(wallId));
        const preparedPosts = preparePosts(posts);

        res.json({ post: preparedPost, posts: preparedPosts });
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/posts', authMiddleware, async (req, res) => {
    const userId = req.body.id;

    try {
        const posts = await Post.aggregate(postsAggregations(userId));
        const preparedPosts = preparePosts(posts);

        res.json({ posts: preparedPosts })
    } catch (e) {
        res.status(500).end();
    }
});

router.delete('/posts', authMiddleware, async (req, res) => {
    const {id} = req.body;
    const {userId} = req.user;

    try {
        const post = await Post.findOne({
            _id: id,
            $or: [
                { owner: userId },
                { wallOwner: userId }
            ]
        });

        if (post) {
            await post.remove();
            await Comment.deleteMany({postId: id});

            await User.findOneAndUpdate(
                {
                    "_id": ObjectId(userId),
                    "posts": ObjectId(id)
                },
                {
                    "$pull": { "posts": ObjectId(id) }
                },
            );
        } else {
            return res.status(500).end();
        }

        res.json({ok: true});
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
});

router.post('/postLike', authMiddleware, async (req, res) => {
    const {userId, postId, like} = req.body;

    try {
        if (!like) {
            // like
            await Post.findOneAndUpdate(
                {
                    "_id": ObjectId(postId),
                    "likes": { "$ne": ObjectId(userId) }
                },
                {
                    "$inc": { "likesCount": 1 },
                    "$push": { "likes": ObjectId(userId) }
                },
                {new: true}
            )
                .populate('owner', 'name')
                .exec(function(err, post) {
                    if (err) throw err;

                    if (!post) {
                        return res.status(429).end();
                    }

                    const data = {
                        _id: postId,
                        isLiked: true,
                        likesCount: post._doc.likes.length
                    };

                    res.json({ok: true, post: data})
                })
        } else {
            // dislike
            await Post.findOneAndUpdate(
                {
                    "_id": ObjectId(postId),
                    "likes": ObjectId(userId)
                },
                {
                    "$inc": { "likesCount": -1 },
                    "$pull": { "likes": ObjectId(userId) }
                },
                {new: true}
            )
                .populate('owner', 'name')
                .exec(function(err, post) {
                    if (err) throw err;

                    if (!post) {
                        return res.status(429).end();
                    }

                    const data = {
                        _id: postId,
                        isLiked: false,
                        likesCount: post._doc.likes.length
                    };

                    return res.json({ok: true, post: data})
                })
        }
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/likeComment', authMiddleware, async (req, res) => {
    const {userId, commentId, like} = req.body;

    try {
        if (!like) {
            // like
            await Comment.findOneAndUpdate(
                {
                    "_id": ObjectId(commentId),
                    "likes": { "$ne": ObjectId(userId) }
                },
                {
                    // "$inc": { "likesCount": 1 },
                    "$push": { "likes": ObjectId(userId) }
                },
                {new: true}
            )
                .exec(function(err, comment) {
                    if (err) throw err;

                    if (!comment) {
                        return res.status(429).end()
                    }

                    const response = {
                        _id: comment._id,
                        likesCount: comment.likes.length,
                        isLiked: true
                    };

                    return res.json({ok: true, comment: response})
                })
        } else {
            // dislike
            await Comment.findOneAndUpdate(
                {
                    "_id": ObjectId(commentId),
                    "likes": ObjectId(userId)
                },
                {
                    // "$inc": { "likesCount": -1 },
                    "$pull": { "likes": ObjectId(userId) }
                },
                {new: true}
            )
                .exec(function(err, comment) {
                    if (err) throw err;

                    if (!comment) {
                        return res.status(429).end()
                    }

                    const response = {
                        _id: comment._id,
                        likesCount: comment.likes.length,
                        isLiked: false
                    };

                    return res.json({ok: true, comment: response})
                })
        }
    } catch (e) {
        res.status(500).end();
    }
});

router.post('/createComment', authMiddleware, async (req, res) => {
    const {userId, postId, text} = req.body;

    try {
        const comment = new Comment({
            userId: ObjectId(userId),
            postId: ObjectId(postId),
            text,
            date: Date.now()
        });

        await comment.save(async function(err, c) {
            if (err) return res.json({ok: false});

            const commentId = c._id;

            await Post.findOneAndUpdate(
                {
                    "_id": ObjectId(postId)
                },
                {
                    "$push": { "comments": ObjectId(commentId) }
                },
                {new: true}
            );

            const comments = await Comment.aggregate([
                {
                    $match: {
                        postId: ObjectId(postId)
                    }
                },
                { $lookup: {
                        "from": "users",
                        "localField": "userId",
                        "foreignField": "_id",
                        "as": "user"
                    }},
                {
                    $addFields: {
                        isLiked: { $in: [ ObjectId(userId), '$likes' ] }
                    }
                },
            ]);

            const preparedComments = prepareComments(comments, (c) => c);

            res.json({ok: true, comments: preparedComments})
        });
    } catch (e) {
        res.status(500).end();
    }
});

module.exports = router;
