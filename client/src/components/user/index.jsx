import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withApiService, withoutOwner} from '../hoc'
import {actionUpdateUserData} from "../../store/actions"
import {bindActionCreators} from "redux"

import PostCreate from "./post-create"
import ProfileWallList from "./profile-wall-list"
import ProfileMain from "./profile-main"

import {getUserInfo} from "../../helpers"

import socket from "../../socket";

import './style.css'
import Spinner from "../spinner";

const User = (props) => {
    const {
        apiService,
        actionUpdateUserData,
        user,
        isUserPage,
        userPageId,
        profileCounters,
        updateProfileCounters,
        avatarUrl,
        setAvatarUrl
    } = props;

    const isOwner = !isUserPage;
    const wallId = isUserPage ? userPageId : user.id;

    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [removedPost, setRemovedPost] = useState(null);

    const [posts, setPosts] = useState({
        items: [],
        itemsUI: {}
    });

    const getPostsInterface = (newPosts) => {
        const postsUI = posts.itemsUI;

        return newPosts.reduce(function(acc, p) {
            const isOpened = (postsUI[p._id] && postsUI[p._id].commentsOpened) || false;
            return {...acc, [p._id]: {
                commentsOpened: isOpened
            }}
        }, {});
    };

    const updateStatePosts = (newPosts) => {
        const postsInterfaces = getPostsInterface(newPosts);
        setPosts(state => {
            return {
                items: newPosts,
                itemsUI: postsInterfaces
            }
        });
    };

    const addStatePosts = (post) => {
        setPosts(state => {
            const newPosts = [post, ...state.items];
            return {
                items: newPosts,
                itemsUI: getPostsInterface(newPosts)
            }
        });
    };

    const updateStatePostsUI = (newPostsUI) => {
        setPosts(state => {
            return {
                items: posts.items,
                itemsUI: newPostsUI
            }
        });
    };

    const removeStatePostsById = (id) => {
        setPosts(state => {
            const posts = state.items;

            const index = posts.findIndex(p => p._id === id);
            const post =  posts[index];

            const newItems = posts.filter(p => p._id !== id);

            setRemovedPost(post);

            return {
                items: newItems,
                itemsUI: getPostsInterface(newItems)
            }
        });
    };

    const fetchPosts = () => {
        setLoading(true);
        apiService.fetchPosts(user.id).then(res => {
            updateStatePosts(res.body.posts);
            setLoading(false);
        }).catch(e => {
            // console.log(e.message)
            setLoading(false);
        })
    };

    useEffect(() => {
        socket.on('createPost', ({post}) => {
            addPost(post);
        });

        socket.on('removePost', ({postId}) => {
            removeStatePostsById(postId);
        });

        socket.on('likePost', ({post, userId}) => {
            updatePostLikes(post, userId);
        });

        socket.on('createComment', ({comments, postId}) => {
            updatePostComments(postId, comments);
        });

        socket.on('likeComment', ({comment, userId, postId}) => {
            updateCommentLikes(postId, comment, userId);
        });

        return () => {
            socket.off('createPost');
            socket.off('removePost');
            socket.off('likePost');
            socket.off('createComment');
            socket.off('likeComment');
        }
    }, []);

    useEffect(() => {
        if (removedPost) {
            const postsCount = profileCounters.postsCount - 1;
            const imagesCount = removedPost.imageUrl ? profileCounters.imagesCount - 1 : profileCounters.imagesCount;

            updateProfileCounters({
                postsCount,
                imagesCount
            });
        }
    }, [removedPost]);

    // socket wall
    useEffect(() => {
        const wallId = isUserPage ? userPageId : user.id;
        socket.emit('connectToWallId', {wallId});
        return () => {
            socket.emit('disconnectToWallId', {wallId})
        }
    }, []);

    useEffect(() => {
        if (isUserPage) {
            // other pages
            setLoading(true);
            apiService.getUserInfo(userPageId, user.id).then(res => {
                const data = res.body.data;
                const {postsCount, imagesCount} = getUserInfo(data.posts);

                setAvatarUrl(data.avatarUrl);
                updateProfileCounters({
                    followersCount: data.followersCount,
                    followingCount: data.followingCount,
                    postsCount,
                    imagesCount
                });

                setUserData({
                    avatarUrl: data.avatarUrl,
                    userName: data.name,
                    userId: data.id,
                    isFollowing: data.isFollowing
                });

                updateStatePosts(data.posts);
                setLoading(false);

            }).catch(e => {
                // console.log(e);
            })
        } else {
            // me
            setUserData({
                ...userData,
                avatarUrl: user.avatarUrl,
                userName: user.name,
                userId: user.id
            });

            fetchPosts();
        }
    }, []);

    const updateUserData = (key, value) => {
        setUserData(state => {
            return {
                ...state,
                [key]: value
            }
        });
    };

    const follow = () => {
        apiService.follow(user.id, userPageId, isFollowing).then(res => {
            const { isFollowing, client, user } = res.body;
            updateUserData('isFollowing', isFollowing);
            updateProfileCounters({
                followingCount: user.followingCount,
                followersCount: user.followersCount
            });
            actionUpdateUserData({
                followingCount: client.followingCount,
                followersCount: client.followersCount
            });
            socket.emit('follow', {toId: userPageId, isFollowing});
        }).catch(e => {

        })
    };

    const toggleComments = (postId) => {
        const postsUI = posts.itemsUI;

        const currentState = postsUI[postId].commentsOpened;
        const newState = {...postsUI, [postId]: {
                commentsOpened: !currentState
        }};

        updateStatePostsUI(newState);
    };

    const updatePostComments = (postId, comments) => {
        setPosts(posts => {
            const state = posts.items;

            const index = state.findIndex((item) => item._id === postId);
            const item = state[index];
            const newItem = {
                ...item,
                comments
            };

            const newItems = [...state.slice(0, index), newItem, ...state.slice(index + 1)];

            const postsUI = posts.itemsUI;
            const newItemsUI = newItems.reduce(function(acc, p) {
                const isOpened = (postsUI[p._id] && postsUI[p._id].commentsOpened) || false;
                return {...acc, [p._id]: {
                        commentsOpened: isOpened
                    }}
            }, {});

            return {
                items: newItems,
                itemsUI: newItemsUI
            }
            // updateStatePosts(newPosts);
        })
    };

    const addPost = (post) => {
        const imagesDiff = post.imageUrl ? 1 : 0;

        updateProfileCounters((currentState) => {
            return {
                postsCount: currentState.postsCount + 1,
                imagesCount: currentState.imagesCount + imagesDiff
            }
        });

        addStatePosts(post);
    };

    const updatePostLikes = (post, userId) => {
        setPosts((posts) => {
            const state = posts.items;

            const {_id, likesCount, isLiked} = post;
            const index = state.findIndex((item) => item._id === _id);
            const item = state[index];

            const newItem = {
                ...item,
                likesCount,
                isLiked: user.id.toString() === userId.toString() ? isLiked : item.isLiked
            };

            const newItems = [...state.slice(0, index), newItem, ...state.slice(index + 1)];

            return {
                items: newItems,
                itemsUI: getPostsInterface(newItems)
            }
        });
    };

    const updateCommentLikes = (postId, comment, userId) => {
        setPosts((posts) => {
            const state = posts.items;

            const {_id, isLiked, likesCount} = comment;
            const postIndex = state.findIndex((item) => item._id === postId);
            const post = state[postIndex];
            const commentIndex = post.comments.findIndex((item) => item._id === comment._id);
            const c = post.comments[commentIndex];
            const newComment = {
                ...c,
                likesCount,
                isLiked: user.id.toString() === userId.toString() ? isLiked : c.isLiked
            };
            const newItem = {
                ...post,
                comments: [...post.comments.slice(0, commentIndex), newComment, ...post.comments.slice(commentIndex + 1)]
            };

            const newItems = [...state.slice(0, postIndex), newItem, ...state.slice(postIndex + 1)];

            const postsUI = posts.itemsUI;
            const newItemsUI = newItems.reduce(function(acc, p) {
                const isOpened = (postsUI[p._id] && postsUI[p._id].commentsOpened) || false;
                return {...acc, [p._id]: {
                        commentsOpened: isOpened
                    }}
            }, {});

            return {
                items: newItems,
                itemsUI: newItemsUI
            }
        })
    };

    const {userName, userId, isFollowing} = userData;

    return (
        <div className="profile">
            <div className="profile__top">
                <ProfileMain
                    profileCounters={profileCounters}
                    isOwner={isOwner}
                    userName={userName}
                    avatarUrl={avatarUrl}
                />
            </div>
            <div className="profile__bottom">
                <div className="container">
                    {
                        !isOwner ? (
                            <div className="profile__actions">
                                <div className="profile__follow">
                                    {
                                        isFollowing ? (
                                            <div onClick={follow} className="btn btn-danger">Unfollow</div>
                                        ) : (
                                            <div onClick={follow} className="btn">Follow</div>
                                        )
                                    }
                                </div>
                            </div>
                        ) : null
                    }
                    <div className="profile__wall">
                        <div className="profile__wall-bar">

                        </div>
                        <div className="profile__wall-left">
                            <div className="profile-wall">
                                <div className="profile-wall__top">
                                    <div className="profile-wall__create">
                                        <PostCreate apiService={apiService} user={props.user} wallId={userId} addPost={addPost} updatePosts={updateStatePosts} />
                                    </div>
                                    {
                                        loading ? (
                                            <Spinner />
                                        ) : null
                                    }
                                </div>
                                <ProfileWallList
                                    isOwner={isOwner}
                                    posts={posts}
                                    apiService={apiService}
                                    user={user}
                                    wallId={wallId}
                                    removePostById={removeStatePostsById}
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
        actionUpdateUserData
    }, dispatch)
};

export default withoutOwner(withApiService(connect(mapStateToProps, mapDispatchToProps)(User)))
