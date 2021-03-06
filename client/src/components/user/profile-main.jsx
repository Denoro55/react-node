import React, {useContext, useEffect, useRef, useState} from 'react'
import {connect, useSelector} from "react-redux";
import cn from "classnames";

import {withApiService} from '../hoc';

import VariableProvider from '../context/vars'
import {bindActionCreators} from "redux";
import {actionUpdateUserData} from "../../store/actions";

const ProfileMain = (props) => {
    const {
        userName,
        profileCounters,
        isOwner,
        avatarUrl,
        backgroundUrl,
        apiService,
        actionUpdateUserData
    } = props;

    const {
        postsCount = 0,
        imagesCount = 0,
        followingCount = 0,
        followersCount = 0,
    } = profileCounters;

    const {publicPath} = useContext(VariableProvider);

    const avatarFileInput = useRef(null);
    const bgFileInput = useRef(null);
    // const user = useSelector(state => state.user);

    const [avatarFormActive, setAvatarFormStatus] = useState(false);
    const [avatarPreviewImage, setAvatarPreviewImage] = useState(null);
    const [bgPreview, setBgPreview] = useState(null);

    const avatarClasses = cn({
        'avatar-form': true,
        'active': avatarFormActive
    });

    const uploadAvatar = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('avatar', avatarFileInput.current.files[0]);
        // data.append('id', user.id);

        apiService.uploadAvatar(data).then(e => {
            resetAvatarForm();
            actionUpdateUserData({
                avatarUrl: e.body.avatarUrl
            });
        }).catch(e => {

        })
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

    const resetBgForm = () => {
        setBgPreview('');
        bgFileInput.current.value = null;
    };

    const onUploadBackground = (e) => {
        const file = e.target.files[0];

        if (file) {
            // setAvatarFormStatus(true);

            const reader = new FileReader();
            reader.readAsDataURL(file);

            reader.onloadend = function () {
                const previewImage = reader.result;
                setBgPreview(previewImage);
            };

        } else {
            resetBgForm();
        }
    };

    const onUploadBgClick = () => {
        bgFileInput.current.click();
    };

    const updateBackground = (e) => {
        e.preventDefault();

        const data = new FormData();
        data.append('background', bgFileInput.current.files[0]);

        apiService.uploadBackground(data).then(e => {
            resetBgForm();
            actionUpdateUserData({
                backgroundUrl: e.body.backgroundUrl
            });
        }).catch(e => {

        })
    };

    const profileClasses = cn({
        'profile-main': true,
        'upload-bg': !!bgPreview
    });

    return (
        <div className={profileClasses}>
            <div className="profile-main__update-bg">
                <div className="update-bg">
                    <input onChange={onUploadBackground} ref={bgFileInput} type="file"/>
                    {
                        bgPreview ? (
                            <>
                                <div onClick={updateBackground} className="btn update-bg__action">Update</div>
                                <div onClick={resetBgForm} className="btn btn-danger update-bg__action">Cancel</div>
                            </>
                        ) : <div onClick={onUploadBgClick} className="btn update-bg__action">Upload</div>
                    }
                </div>
            </div>
            <div className='profile-main__background'>
                <div className='profile-main__background-current' style={{backgroundImage: `url(${publicPath}${backgroundUrl})`}}>
                </div>
                <div className='profile-main__background-new' style={{backgroundImage: `url(${bgPreview})`}}>
                </div>
            </div>
            <div className="profile-main__info">
                <div className="profile-info">
                    <div className="profile-info__top">
                        <div className="container">
                            <div className="profile-info__avatar">
                                <div className="profile-info__avatar-image" style={{backgroundImage: `url(${publicPath}${avatarUrl})`}}>
                                    {
                                        isOwner ? (
                                            <div className="profile-info__form">
                                                <form onSubmit={uploadAvatar} className={avatarClasses}>
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
                            <div className="profile-info__list">
                                <div className="profile-info__item">
                                    <div className="profile-info__value">
                                        {followersCount}
                                    </div>
                                    <div className="profile-info__key">
                                        Followers
                                    </div>
                                </div>
                                <div className="profile-info__item">
                                    <div className="profile-info__value">
                                        {followingCount}
                                    </div>
                                    <div className="profile-info__key">
                                        Following
                                    </div>
                                </div>
                                <div className="profile-info__item">
                                    <div className="profile-info__value">
                                        {imagesCount}
                                    </div>
                                    <div className="profile-info__key">
                                        Photos
                                    </div>
                                </div>
                                <div className="profile-info__item">
                                    <div className="profile-info__value">
                                        {postsCount}
                                    </div>
                                    <div className="profile-info__key">
                                        Posts
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="profile-info__bottom">
                        <div className="container">
                            <div className="profile-main__name">
                                {userName}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        actionUpdateUserData
    }, dispatch)
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(ProfileMain))
