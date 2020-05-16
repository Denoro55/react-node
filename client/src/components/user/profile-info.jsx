import React from "react";

const ProfileInfo = (props) => {
    const {postsCount = 0, imagesCount = 0, followingCount = 0, followersCount = 0} = props;

    return (
        <div className="profile-info">
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
    )
};

export default ProfileInfo;
