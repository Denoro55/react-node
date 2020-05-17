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

const messagesAggregation = (id) => {
    return [
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
    ]
};

module.exports = {
    postsAggregations,
    messagesAggregation
};
