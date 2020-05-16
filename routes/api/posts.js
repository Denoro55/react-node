const {Router} = require('express');
const router = Router();
const authMiddleware = require('../../middleware/auth');

const mongoose = require('mongoose');
const Post = require('../../models/Post');
const Comment = require('../../models/Comment');
const User = require('../../models/User');
const ObjectId = mongoose.Types.ObjectId;

const fileMiddleware = require('../../middleware/file');

const timeSince = require('../../utils/timeSince');

router.post('/createPost', authMiddleware, fileMiddleware.single('image'), async (req, res) => {
    const {id, wallId, text} = req.body;

    const user = await User.findOne({_id: id});
    let filename;

    if (req.file) {
        filename = req.file.filename;
    }

    const post = new Post({
        wallOwner: ObjectId(wallId),
        owner: user,
        text: text,
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
    const userId = req.body.id;
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
                isLiked: { $in: [ ObjectId(userId), '$likes' ] }
            }
        },
        { $project: { likes: 0 } }
    ]);

    console.log(posts);

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

    res.json({ posts: preparedPosts })
});

router.delete('/posts', authMiddleware, async (req, res) => {
    const post = await Post.findOne({_id: req.body.id});
    await post.remove();

    res.json({ok: true});
});

router.post('/postLike', authMiddleware, async (req, res) => {
    const {userId, postId, like} = req.body;

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
                return res.status(429).json({ok: false});
            }

            const data = {
                _id: postId,
                isLiked: true,
                likesCount: post._doc.likes.length
            };

            // const data = {
            //     ...post._doc,
            //     isLiked: true,
            //     user: {
            //         name: post.owner.name
            //     }
            // };

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
                return res.status(429).json({ok: false});
            }

            const data = {
                _id: postId,
                isLiked: false,
                likesCount: post._doc.likes.length
            };

            // const data = {
            //     ...post._doc,
            //     isLiked: false,
            //     user: {
            //         name: post.owner.name
            //     }
            // };

            return res.json({ok: true, post: data})
        })
    }
});

router.post('/postComment', authMiddleware, async (req, res) => {
    const {userId, postId, text} = req.body;

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
        ]);

        const preparedComments = comments.map(c => {
            const {name, avatarUrl} = c.user[0];

            return {
                ...c,
                time: timeSince(new Date(c.date)),
                user: { name, avatarUrl }
            }
        });

        res.json({ok: true, comments: preparedComments})
    });
});

module.exports = router;
