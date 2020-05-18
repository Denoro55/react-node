import React, {useCallback, useState} from 'react'
import {connect} from 'react-redux'
import ProfileMain from "../user/profile-main"
import {useSelector} from "react-redux"
import {withApiService} from '../hoc'
import Users from '../users'

import './style.css'

const Search = (props) => {
    const {apiService} = props;
    const user = useSelector(state => state.user);

    const {followersCount, followingCount, imagesCount, postsCount, avatarUrl, name} = user;

    const [result, setResult] = useState('');
    const [match, setMatch] = useState('');

    const fetchFunc = useCallback(() => {
        return apiService.fetchUsers(result);
    }, [result]);

    const profileCounters = {
        followersCount, followingCount, imagesCount, postsCount
    };

    const findUsers = (e) => {
        e.preventDefault();
        setResult(match);
    };

    const onTextChange = ((e) => {
        setMatch(e.target.value)
    });

    return (
        <div className="profile">
            <div className="profile__top">
                <ProfileMain
                    profileCounters={profileCounters}
                    avatarUrl={avatarUrl}
                    userName={name}
                    isOwner={true}
                />
            </div>
            <div className="profile__bottom">
                <div className="container">
                    <div className="search">
                        <form onSubmit={findUsers} className="search__form">
                            <div className="search__text">
                                <input value={match} onChange={onTextChange} placeholder="Type a name" type="text"/>
                            </div>
                            <div className="search__find">
                                <button type="submit" className="btn">Find</button>
                            </div>
                        </form>
                        <div className="search__result">
                            <Users fetchFunc={fetchFunc}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default withApiService(connect()(Search));
