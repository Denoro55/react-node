import React, {useContext, useEffect, useState} from "react";
import ProfileInfo from "../me/profile-info";
import {withApiService, withoutOwner} from '../hoc';

import {getUserInfo} from "../../helpers";
import VariableProvider from "../context/vars";

import ProfileWallList from "./profile-wall-list";
import {connect} from "react-redux";

const User = (props) => {
    const userId = props.computedMatch.params.id;
    const {user, apiService} = props;

    const [userData, setUserData] = useState({
        posts: []
    });
    const {path: publicPath} = useContext(VariableProvider);

    useEffect(() => {
        apiService.getUserInfo(userId, user.id).then(res => {
            setUserData(res.body.data);
        }).catch(e => {

        })
    }, []);

    const updatePost = (id, newItem) => {
        const index = posts.findIndex((item) => item._id === id);
        const newItems = [...posts.slice(0, index), newItem, ...posts.slice(index + 1)];
        setUserData((state) => ({
            ...state,
            posts: newItems
        }));
    };

    const {name, posts, avatarUrl} = userData;
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
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile__bottom">
                <div className="container">
                    <div className="profile__name">{name}</div>
                    <div className="profile__actions">
                        <div className="profile__follow">
                            <div className="btn">Follow</div>
                        </div>
                    </div>
                    <div className="profile__wall">
                        <div className="profile__wall-bar">

                        </div>
                        <div className="profile__wall-left">
                            <div className="profile-wall">
                                <ProfileWallList posts={posts} apiService={apiService} user={user} updatePost={updatePost} />
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

export default withoutOwner(withApiService(connect(mapStateToProps)(User)))
