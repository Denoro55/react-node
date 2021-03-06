const {Schema, model} = require('mongoose');

const postSchema = new Schema({
    wallOwner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now()
    },
    text: {
        type: String
    },
    imageUrl: {
        type: String
    },
    likesCount: {
        type: Number,
        default: 0
    },
    likes: {
        type: Array
    },
    commentsCount: {
        type: Number,
        default: 0
    },
    comments: {
        type: Array
    }
});

module.exports = model('Post', postSchema);
