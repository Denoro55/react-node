const timeSince = require('./timeSince');
const prepareComments = require('./prepareComments');

const preparePosts = (posts) => {
    return posts.map(post => {
        return {
            ...post,
            comments: prepareComments(post.comments, (c) => c.body),
            user: {
                name: post.user[0].name
            },
            time: timeSince(new Date(post.date))
        }
    });
};

module.exports = preparePosts;
