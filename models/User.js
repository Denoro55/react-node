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
    },
    followers: {
        type: Array
    },
    following: {
        type: Array
    }
});

module.exports = model('User', userSchema);
