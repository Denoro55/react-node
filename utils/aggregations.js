const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;

const postsAggregations = (userId, clientId = userId) => {
    return [
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
            $addFields: {
                "comments.isLiked": {
                    $cond: {
                        if: { $ne:  [ { $type : "$comments"}, 'missing'] } ,
                        then: {
                            $cond: {
                                if: { $in: [ ObjectId(clientId), "$comments.likes" ] } ,
                                then: true,
                                else: false
                            }
                        },
                        else: "$$REMOVE"
                    }
                }
            }
        },
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
    ];
};

module.exports = {
    postsAggregations
};
