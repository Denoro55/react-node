const prepareFollowers = (followers, getUser) => {
    return followers.map(user => {
        const f = getUser(user);

        return {
            _id: f._id,
            name: f.name,
            avatarUrl: f.avatarUrl,
            followersCount: f.followers.length,
            followingCount: f.following.length,
            postsCount: f.posts.length,
            isFollowing: user.isFollowing
        }
    });
};

module.exports = prepareFollowers;
