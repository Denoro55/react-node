import React, {useEffect, useState, useRef, useContext} from 'react'
import {connect} from 'react-redux'
import {withApiService, withoutOwner} from '../hoc';
import {actionUpdateUserAvatar} from "../../store/actions"
import {bindActionCreators} from "redux"
import VariableProvider from '../context/vars'

import PostCreate from "./post-create";
import ProfileWallList from "./profile-wall-list";
import ProfileInfo from "./profile-info";

import {getUserInfo} from "../../helpers";

import cn from 'classnames'
import './style.css'

const User = (props) => {
    const {apiService, actionUpdateUserAvatar, user, isUserPage, userPageId} = props;
    const {id} = user;
    const isOwner = !isUserPage;

    const {path: publicPath} = useContext(VariableProvider);

    const avatarFileInput = useRef(null);

    const [userName, setUserName] = useState('');
    const [userId, setUserId] = useState(null);
    const [avatarUrl, setAvatarUrl] = useState(null);
    const [avatarFormActive, setAvatarFormStatus] = useState(false);
    const [avatarPreviewImage, setAvatarPreviewImage] = useState(null);
    const [posts, setPosts] = useState([]);
    const [postsUI, setPostsUI] = useState([]);

    const getPostsInterface = (posts) => {
        return posts.reduce(function(acc, p) {
            return {...acc, [p._id]: {
                    commentsOpened: false
                }}
        }, {});
    };

    useEffect(() => {
        if (isUserPage) {
            // other pages
            apiService.getUserInfo(userPageId, id).then(res => {
                const data = res.body.data;

                setAvatarUrl(data.avatarUrl);
                setUserName(data.name);
                setUserId(data.id);

                setPostsUI(getPostsInterface(data.posts));
                setPosts(data.posts);
            }).catch(e => {
                console.log(e);
            })
        } else {
            // me
            setAvatarUrl(user.avatarUrl);
            setUserName(user.name);
            setUserId(user.id);

            apiService.fetchPosts(id).then(res => {
                setPostsUI(getPostsInterface(res.body.posts));
                setPosts(res.body.posts);
            }).catch(e => {
                console.log(e);
            })
        }
    }, []);

    const toggleComments = (postId) => {
        const currentState = postsUI[postId].commentsOpened;
        const newState = {...postsUI, [postId]: {
                commentsOpened: !currentState
        }};
        setPostsUI(newState);
    };

    const updatePostComments = (postId, comments) => {
        setPosts((state) => {
            const index = state.findIndex((item) => item._id === postId);
            const newItem = {
                ...state[index],
                comments
            };

            return [...state.slice(0, index), newItem, ...state.slice(index + 1)];
        });
    };

    const addPost = (post) => {
        const postsInterface = {...postsUI, [post._id]: {commentsOpened: false}};
        setPostsUI(postsInterface);
        setPosts([post, ...posts]);
    };

    const updatePostLikes = (post) => {
        setPosts((state) => {
            const {_id, ...newParams} = post;
            const index = state.findIndex((item) => item._id === _id);
            const newItem = {
                ...state[index],
                ...newParams
            };

            return [...state.slice(0, index), newItem, ...state.slice(index + 1)];
        });
    };

    const updateCommentLikes = (postId, comment) => {
        setPosts((state) => {
            const {_id, ...newParams} = comment;
            const postIndex = state.findIndex((item) => item._id === postId);
            const post = state[postIndex];
            const commentIndex = post.comments.findIndex((item) => item._id === comment._id);
            const c = post.comments[commentIndex];
            const newComment = {
                ...c,
                ...newParams
            };
            const newItem = {
                ...post,
                comments: [...post.comments.slice(0, commentIndex), newComment, ...post.comments.slice(commentIndex + 1)]
            };

            return [...state.slice(0, postIndex), newItem, ...state.slice(postIndex + 1)];
        });
    };

    const removePostById = (id) => {
        const newPosts = posts.filter(p => p._id !== id);
        setPosts(newPosts);
    };

    const onFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFormStatus(true);

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = function () {
                const previewImage = reader.result;
                setAvatarPreviewImage(previewImage);
            };

        } else {
            setAvatarFormStatus(false);
        }
    };

    const resetAvatarForm = () => {
        setAvatarFormStatus(false);
        avatarFileInput.current.value = null;
    };

    const uploadAvatar = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('avatar', avatarFileInput.current.files[0]);
        data.append('id', id);

        apiService.uploadAvatar(data).then(e => {
            resetAvatarForm();
            actionUpdateUserAvatar(e.avatarUrl)
        })
    };

    const avatarClasses = cn({
        'profile__avatar-form': true,
        'active': avatarFormActive
    });

    const {postsCount, imagesCount} = getUserInfo(posts);

    return (
        <div className="profile">
            <div className="profile__top">
                <div className="profile__background" style={{backgroundImage: 'url(https://images2.alphacoders.com/209/thumb-1920-209080.jpg)'}}>

                </div>
                <div className="profile__info">
                    <div className="container">
                        <ProfileInfo imagesCount={imagesCount} postsCount={postsCount} />
                    </div>
                </div>
                <div className="profile__avatar">
                    <div className="container">
                        <div className="profile__avatar-image" style={{backgroundImage: `url(${publicPath}${avatarUrl})`}}>
                            {
                                isOwner ? (
                                    <div className={avatarClasses}>
                                        <form onSubmit={uploadAvatar} className="avatar-form">
                                            <label className="avatar-form__label">
                                                Upload a new photo
                                                <input ref={avatarFileInput} onChange={onFileUpload} type="file"/>
                                            </label>
                                            <div className="avatar-form__content">
                                                <div className="avatar-form__preview" style={{backgroundImage: `url(${avatarPreviewImage})`}}>

                                                </div>
                                                <div className="avatar-form__actions">
                                                    <div className="avatar-form__apply">
                                                        <button type="submit" className="btn">Apply</button>
                                                    </div>
                                                    <div className="avatar-form__cancel">
                                                        <div onClick={resetAvatarForm} className="btn btn-danger">Cancel</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                ) : null
                            }
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile__bottom">
                <div className="container">
                    <div className="profile__name">{userName}</div>
                    {
                        !isOwner ? (
                            <div className="profile__actions">
                                <div className="profile__follow">
                                    <div className="btn">Follow</div>
                                </div>
                            </div>
                        ) : null
                    }
                    <div className="profile__wall">
                        <div className="profile__wall-bar">

                        </div>
                        <div className="profile__wall-left">
                            <div className="profile-wall">
                                <div className="profile-wall__create">
                                    <PostCreate apiService={apiService} user={props.user} wallId={userId} addPost={addPost} />
                                </div>
                                <ProfileWallList
                                    isOwner={isOwner}
                                    posts={posts}
                                    postsUI={postsUI}
                                    apiService={apiService}
                                    user={user}
                                    removePostById={removePostById}
                                    updatePostLikes={updatePostLikes}
                                    updatePostComments={updatePostComments}
                                    toggleComments={toggleComments}
                                    updateCommentLikes={updateCommentLikes}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        actionUpdateUserAvatar
    }, dispatch)
};

export default withoutOwner(withApiService(connect(mapStateToProps, mapDispatchToProps)(User)))
