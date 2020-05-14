import React, {useContext} from "react";
import VariableProvider from '../context/vars'

const ProfileWallList = (props) => {
    const {posts, owner = false, user, apiService, removePostById, updatePost} = props;
    const {path: publicPath} = useContext(VariableProvider);

    const removePost = (id) => {
        apiService.removePost(id).then((res) => {
            removePostById(id);
        })
    };

    const likePost = (postId, isLiked) => {
        apiService.likePost(user.id, postId, isLiked).then(res => {
            console.log(res);
            if (!res.body.ok) {

            } else {
                const {post} = res.body;
                console.log('like post', post);
                updatePost(postId, post);
            }
        })
    };

    const renderPostIcon = (isImage) => {
        if (isImage) {
            return (
                <div className="post-icon post-icon_green">
                    <i className="fa fa-picture-o" aria-hidden="true"/>
                </div>
            )
        }

        return (
            <div className="post-icon post-icon_tomato">
                <i className="fa fa-pencil" aria-hidden="true"/>
            </div>
        )
    };

    const renderPostInfo = (post) => {
        return (
            <div className="post-info">
                <div className="post-info__comments">
                    <i className="fa fa-comment-o" aria-hidden="true"/> 0 Comments
                </div>
                <div className="post-info__likes">
                    <div onClick={() => likePost(post._id, post.isLiked)} className="post-likes">
                        {
                            !post.isLiked ? (
                                <i className="fa fa-heart-o" aria-hidden="true"/>
                            ) : (
                                <i style={{color: 'red'}} className="fa fa-heart" aria-hidden="true"/>
                            )
                        } {post.likeCount} Likes
                    </div>
                </div>
            </div>
        )
    };

    const renderPostImage = (post, info = true) => {
        return (
            <div className="profile-post__image">
                <img src={`${publicPath}${post.imageUrl}`} alt=""/>
                {
                    info ? renderPostInfo(post) : null
                }
            </div>
        )
    };

    const renderPostContent = (post, isPhotoPost) => {
        if (isPhotoPost) {
            return renderPostImage(post)
        }

        return (
            <>
                {
                    post.imageUrl ? (
                        renderPostImage(post, false)
                    ) : null
                }
                <div className="profile-post__body">
                    <div className="profile-post__content">
                        { post.text }
                    </div>
                </div>
                <div className="profile-post__info">
                    { renderPostInfo(post) }
                </div>
            </>
        )
    };

    const renderPosts = () => {
        return posts.map(post => {
            const isPhotoPost = post.imageUrl && !post.text;
            const typeText = isPhotoPost ? 'a photo' : 'an article';

            return (
                <div key={post._id} className="profile-wall__item">
                    <div className="profile-post">
                        <div className="profile-post__icon">
                            { renderPostIcon(isPhotoPost) }
                        </div>
                        {
                            owner ? (
                                <div className="profile-post__remove">
                                    <div onClick={() => removePost(post._id)} className="post-icon post-icon_remove">
                                        <i className="fa fa-times" aria-hidden="true"/>
                                    </div>
                                </div>
                            ) : null
                        }
                        <div className="profile-post__head">
                            <div className="profile-post__head-left">
                                <span className="profile-post__name">{post.user.name}</span> posted {typeText}
                            </div>
                            <div className="profile-post__head-right">
                                { post.time }
                            </div>
                        </div>
                        { renderPostContent(post, isPhotoPost) }
                    </div>
                </div>
            )
        })
    };

    return (
        <div className="profile-wall__list">
            { renderPosts() }
        </div>
    )
};

export default ProfileWallList;
