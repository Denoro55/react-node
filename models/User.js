const {Schema, model} = require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatarUrl: {
        type: String
    },
    backgroundUrl: {
        type: String
    }
    // messagesRead: [{
    //     date: {
    //         type: Date,
    //         default: Date.now()
    //     },
    //     to: {
    //         type: Schema.Types.ObjectId,
    //         ref: 'User'
    //     }
    // }]
});

module.exports = model('User', userSchema);
