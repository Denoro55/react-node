const {Schema, model} = require('mongoose');

const commentSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    postId: {
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
    likes: {
        type: Array
    }
});

module.exports = model('Comment', commentSchema);
