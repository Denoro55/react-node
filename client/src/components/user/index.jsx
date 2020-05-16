import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withApiService, withoutOwner} from '../hoc'
import {actionUpdateUserData} from "../../store/actions"
import {bindActionCreators} from "redux"

import PostCreate from "./post-create"
import ProfileWallList from "./profile-wall-list"
import ProfileMain from "./profile-main"

import {getUserInfo} from "../../helpers"

import './style.css'

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

    const [userData, setUserData] = useState({});

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

                setPostsUI(getPostsInterface(data.posts));
                setPosts(data.posts);
            }).catch(e => {
                console.log(e);
            })
        } else {
            // me
            setUserData({
                ...userData,
                avatarUrl: user.avatarUrl,
                userName: user.name,
                userId: user.id,
                // followersCount: user.followersCount,
                // followingCount: user.followingCount
            });

            apiService.fetchPosts(user.id).then(res => {
                setPostsUI(getPostsInterface(res.body.posts));
                setPosts(res.body.posts);
            }).catch(e => {
                console.log(e);
            })
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
            setUserData(state => {
                return {
                    ...state,
                    followingCount: user.followingCount,
                    followersCount: user.followersCount
                }
            });
            actionUpdateUserData({
                followingCount: client.followingCount,
                followersCount: client.followersCount
            });
        })
    };

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
        setPosts((state) => {
            return [post, ...state]
        });

        const postsCount = profileCounters.postsCount + 1;
        const imagesCount = post.imageUrl ? profileCounters.imagesCount + 1 : profileCounters.imagesCount;

        updateProfileCounters({
            postsCount,
            imagesCount
        })

        // setUserData(state => {
        //     return {
        //         ...state,
        //         postsCount,
        //         imagesCount
        //     }
        // });
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

    // const {userName, userId, followersCount, followingCount, postsCount, imagesCount, isFollowing} = userData;
    const {userName, userId, isFollowing} = userData;

    return (
        <div className="profile">
            <div className="profile__top">
                <ProfileMain
                    profileCounters={profileCounters}
                    apiService={apiService}
                    isOwner={isOwner}
                    userName={userName}
                    avatarUrl={avatarUrl}
                    actionUpdateUserData={actionUpdateUserData}
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
        actionUpdateUserData
    }, dispatch)
};

export default withoutOwner(withApiService(connect(mapStateToProps, mapDispatchToProps)(User)))
