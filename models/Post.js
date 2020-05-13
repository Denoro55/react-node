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
    }
});

module.exports = model('Post', postSchema);
