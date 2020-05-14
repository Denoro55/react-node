import React, {useEffect, useState, useRef, useContext} from 'react'
import {connect, useSelector} from 'react-redux'
import {withApiService} from '../hoc'
import {actionUpdateUserAvatar} from "../../store/actions"
import cn from 'classnames'
import './style.css'
import {bindActionCreators} from "redux"
import VariableProvider from '../context/vars'

import PostCreate from "./post-create";
import ProfileWallList from "../user/profile-wall-list";
import ProfileInfo from "./profile-info";

import {getUserInfo} from "../../helpers";

const Me = (props) => {
    const {apiService, actionUpdateUserAvatar} = props;
    const {user} = props;
    const {name, id} = user;

    const {path: publicPath} = useContext(VariableProvider);

    const avatarFileInput = useRef(null);

    const avatarUrl = useSelector(state => state.user.avatarUrl);
    const [avatarFormActive, setAvatarFormStatus] = useState(false);
    const [avatarPreviewImage, setAvatarPreviewImage] = useState(null);

    const [posts, setPosts] = useState([]);

    const addPost = (post) => {
        setPosts([post, ...posts]);
    };

    const updatePost = (id, newItem) => {
        const index = posts.findIndex((item) => item._id === id);
        const newItems = [...posts.slice(0, index), newItem, ...posts.slice(index + 1)];
        setPosts(newItems);
    };

    const removePostById = (id) => {
        const newPosts = posts.filter(p => p._id !== id);
        setPosts(newPosts);
    };

    useEffect(() => {
        apiService.fetchPosts(id).then(res => {
           setPosts(res.body.posts);
        }).catch(e => {
            console.log(e);
        })
    }, []);

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
                        </div>
                    </div>
                </div>
            </div>
            <div className="profile__bottom">
                <div className="container">
                    <div className="profile__name">{name}</div>
                    <div className="profile__wall">
                        <div className="profile__wall-bar">

                        </div>
                        <div className="profile__wall-left">
                            <div className="profile-wall">
                                <div className="profile-wall__create">
                                    <PostCreate apiService={apiService} user={props.user} addPost={addPost} />
                                </div>
                                <ProfileWallList owner={true} posts={posts} apiService={apiService} user={user} removePostById={removePostById} updatePost={updatePost} />
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

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(Me))
