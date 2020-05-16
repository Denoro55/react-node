const timeSince = require('./timeSince');

const prepareComments = (comments, getBody) => {
    return comments.map(c => {
        const {name, avatarUrl} = c.user[0];

        return {
            ...getBody(c),
            time: timeSince(new Date(getBody(c).date)),
            likesCount: getBody(c).likes.length,
            user: { name, avatarUrl }
        }
    });
};

module.exports = prepareComments;
