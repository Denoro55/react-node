import React, {useCallback, useEffect, useState} from 'react'
import {connect} from 'react-redux'
import ProfileMain from "../user/profile-main";
import {useSelector} from "react-redux";
import {withApiService} from '../hoc';
import Users from '../users';

const Following = (props) => {
    const {apiService} = props;
    const user = useSelector(state => state.user);

    const {followersCount, followingCount, imagesCount, postsCount, avatarUrl, backgroundUrl, name} = user;

    const profileCounters = {
        followersCount, followingCount, imagesCount, postsCount
    };

    const fetchFunc = useCallback((...args) => {
        return apiService.fetchFollowing(...args);
    }, []);

    return (
        <div className="profile">
            <div className="profile__top">
                <ProfileMain
                    profileCounters={profileCounters}
                    avatarUrl={avatarUrl}
                    backgroundUrl={backgroundUrl}
                    userName={name}
                    isOwner={true}
                />
            </div>
            <div className="profile__bottom">
                <div className="container">
                    <Users fetchFunc={fetchFunc}/>
                </div>
            </div>
        </div>
    )
};

export default withApiService(connect()(Following));
