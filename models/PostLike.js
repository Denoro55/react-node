const {Schema, model} = require('mongoose');

const postLikeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    post: {
        type: Schema.Types.ObjectId,
        ref: 'Post'
    }
});

module.exports = model('PostLike', postLikeSchema);
