import React, {useEffect, useState, useRef} from 'react'
import {connect, useSelector} from 'react-redux'
import {withApiService} from '../hoc'
import {actionUpdateUserAvatar} from "../../store/actions"
import cn from 'classnames'
import './style.css'
import {bindActionCreators} from "redux"

import PostCreate from "./post-create";
import ProfileWallList from "./profile-wall-list";
import ProfileInfo from "./profile-info";

const Me = (props) => {
    const {apiService, actionUpdateUserAvatar} = props;
    const {name, id, token} = props.user;

    const avatarFileInput = useRef(null);

    const avatarUrl = useSelector(state => state.user.avatarUrl);
    const [avatarFormActive, setAvatarFormStatus] = useState(false);
    const [avatarPreviewImage, setAvatarPreviewImage] = useState(null);

    const [posts, setPosts] = useState([]);

    const addPost = (post) => {
        setPosts([post, ...posts]);
    };

    useEffect(() => {
        apiService.fetchPosts(id, token).then(res => {
           setPosts(res.posts);
        });
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

        apiService.uploadAvatar(data, token).then(e => {
            resetAvatarForm();
            actionUpdateUserAvatar(e.avatarUrl)
        })
    };

    const avatarClasses = cn({
        'profile__avatar-form': true,
        'active': avatarFormActive
    });

    return (
        <div className="profile">
            <div className="profile__top">
                <div className="profile__background" style={{backgroundImage: 'url(https://images2.alphacoders.com/209/thumb-1920-209080.jpg)'}}>

                </div>
                <div className="profile__info">
                    <div className="container">
                        <ProfileInfo />
                    </div>
                </div>
                <div className="profile__avatar">
                    <div className="container">
                        <div className="profile__avatar-image" style={{backgroundImage: `url(/public/images/${avatarUrl})`}}>
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
                    {/*<div className="profile__actions">*/}
                    {/*    <div className="profile__follow">*/}
                    {/*        <div className="btn">Follow</div>*/}
                    {/*    </div>*/}
                    {/*</div>*/}
                    <div className="profile__wall">
                        <div className="profile__wall-bar">

                        </div>
                        <div className="profile__wall-left">
                            <div className="profile-wall">
                                <div className="profile-wall__create">
                                    <PostCreate apiService={apiService} user={props.user} addPost={addPost} />
                                </div>
                                <ProfileWallList posts={posts} />
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
