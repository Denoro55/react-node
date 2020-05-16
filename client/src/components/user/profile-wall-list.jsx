import React, {useContext} from "react";
import VariableProvider from '../context/vars'

const ProfileWallList = (props) => {
    const {posts, postsUI, isOwner = false, user, apiService, removePostById, toggleComments, updatePostLikes, updatePostComments} = props;
    const {path: publicPath} = useContext(VariableProvider);

    const createComment = (e, postId) => {
        e.preventDefault();
        const text = e.target.elements[0].value;
        if (text) {
            apiService.createComment(user.id, postId, text).then((res) => {
                updatePostComments(postId, res.body.comments);
            });
            e.target.reset();
        }
    };

    const removePost = (id) => {
        apiService.removePost(id).then((res) => {
            removePostById(id);
        })
    };

    const likePost = (postId, isLiked) => {
        apiService.likePost(user.id, postId, isLiked).then(res => {
            if (res.body.ok) {
                const { post } = res.body;
                updatePostLikes(post);
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
                    <div onClick={() => toggleComments(post._id)} className="post-comments-button">
                        <i className="fa fa-comment-o" aria-hidden="true"/> {post.comments.length} Comments
                    </div>
                </div>
                <div className="post-info__likes">
                    <div onClick={() => likePost(post._id, post.isLiked)} className="post-likes-button">
                        {
                            !post.isLiked ? (
                                <i className="fa fa-heart-o" aria-hidden="true"/>
                            ) : (
                                <i style={{color: 'red'}} className="fa fa-heart" aria-hidden="true"/>
                            )
                        } {post.likesCount} Likes
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
        let topHtml = null;

        if (isPhotoPost) {
            topHtml = renderPostImage(post);
        } else {
            topHtml = (
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
        }

        return (
            <>
                { topHtml }
                {
                    postsUI[post._id].commentsOpened ? (
                        <div className="profile-post__comments">
                            <div className="post-comment">
                                {
                                    post.comments.length ? (
                                        <div className="post-comment__list">
                                            { post.comments.map(c => {
                                                return (
                                                    <div key={c._id} className="post-comment__item">
                                                        <div className="post-comment__avatar" style={{backgroundImage: `url(${publicPath}${c.user.avatarUrl})`}}>

                                                        </div>
                                                        <div className="post-comment__content">
                                                            <div className="post-comment__head">
                                                                <div className="post-comment__name">
                                                                    <strong>{c.user.name}</strong>
                                                                </div>
                                                                <div className="post-comment__date">
                                                                    {c.time}
                                                                </div>
                                                            </div>
                                                            <div className="post-comment__body">
                                                                <div className="post-comment__text">
                                                                    {c.text}
                                                                </div>
                                                                <div className="post-comment__likes">
                                                                    <div className="comment-like">
                                                                        <i className="fa fa-heart-o" aria-hidden="true"/> 12
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            }) }
                                        </div>
                                    ) : null
                                }
                                <div className="post-comment__create">
                                    <form onSubmit={(e) => createComment(e, post._id)} className="comment-create">
                                        <div className="comment-create__input">
                                            <textarea className="textarea-theme" cols="30" rows="10" />
                                        </div>
                                        <div className="comment-create__actions">
                                            <div className="comment-create__action">
                                                <button className="btn">Comment</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </>
        )
    };

    const renderPosts = () => {
        return posts.map((post) => {
            const isPhotoPost = post.imageUrl && !post.text;
            const typeText = isPhotoPost ? 'a photo' : 'an article';

            return (
                <div key={post._id} className="profile-wall__item">
                    <div className="profile-post">
                        <div className="profile-post__icon">
                            { renderPostIcon(isPhotoPost) }
                        </div>
                        {
                            isOwner ? (
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
