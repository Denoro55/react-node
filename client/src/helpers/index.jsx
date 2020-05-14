const getUserInfo = (posts) => {
    const postsCount = posts.length;
    const postsWithImages = posts.filter(p => p.imageUrl);
    const imagesCount = postsWithImages.length;

    return {
        postsCount,
        imagesCount
    }
};

export {
    getUserInfo
}
