import React from "react";

const ProfileInfo = (props) => {
    const {postsCount, imagesCount} = props;

    return (
        <div className="profile-info">
            <div className="profile-info__list">
                <div className="profile-info__item">
                    <div className="profile-info__value">
                        0
                    </div>
                    <div className="profile-info__key">
                        Followers
                    </div>
                </div>
                <div className="profile-info__item">
                    <div className="profile-info__value">
                        0
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
    )
};

export default ProfileInfo;
