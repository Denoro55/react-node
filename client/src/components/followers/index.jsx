import React from 'react'
import {connect} from 'react-redux'
import ProfileMain from "../user/profile-main";
import {useSelector} from "react-redux";

const Followers = (props) => {
    const user = useSelector(state => state.user);

    const {followersCount, followingCount, imagesCount, postsCount, avatarUrl, name} = user;

    return (
        <div className="profile">
            <div className="profile__top">
                <ProfileMain
                    followersCount={followersCount}
                    followingCount={followingCount}
                    imagesCount={imagesCount}
                    postsCount={postsCount}
                    avatarUrl={avatarUrl}
                    userName={name}
                />
            </div>
            <div className="profile__bottom">

            </div>
        </div>
    )
};

export default connect()(Followers);
