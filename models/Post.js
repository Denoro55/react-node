const {Schema, model} = require('mongoose');

const postSchema = new Schema({
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
    likeCount: {
        type: Number,
        default: 0
    },
    likes: {
        type: Array
    }
});

module.exports = model('Post', postSchema);
