const {Schema, model} = require('mongoose');

const messageSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    from: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

module.exports = model('Message', messageSchema);
