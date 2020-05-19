import {NavLink} from "react-router-dom"
import React, {useContext} from "react"

import VariableProvider from '../context/vars'
import {withApiService} from '../hoc'

import './style.css'
import {bindActionCreators} from "redux"
import {actionUpdateUserData} from "../../store/actions"
import {connect} from "react-redux"
import socket from "../../socket";

const UserCard = (props) => {
    const {
        _cardId,
        _id,
        name,
        followersCount,
        followingCount,
        postsCount,
        avatarUrl,
        isFollowing,
        apiService,
        actionUpdateUserData,
        updateUser
    } = props;

    const {publicPath} = useContext(VariableProvider);

    const follow = (cardId) => {
        apiService.follow(_id, cardId, isFollowing).then(res => {
            if (res.body.ok) {
                const { isFollowing, client, user: {followingCount, followersCount} } = res.body;

                updateUser(cardId, {
                    isFollowing,
                    followingCount,
                    followersCount
                });

                actionUpdateUserData({
                    followingCount: client.followingCount,
                    followersCount: client.followersCount
                });
                socket.emit('follow', {toId: cardId, isFollowing});
            }
        }).catch(e => {
            console.log(e);
        })
    };

    return (
        <div className="user-card">
            <div className="user-card__body">
                <div className="user-card__head">
                    <div className="user-card__image" style={{backgroundImage: `url(${publicPath}${avatarUrl})`}}>

                    </div>
                </div>
                <div className="user-card__name">
                    {name}
                </div>
            </div>
            <div className="user-card__actions">
                {
                    _id !== _cardId ? (
                        <div onClick={() => follow(_cardId)} className="user-card__action link-yellow">
                            {
                                isFollowing ? 'Unfollow' : 'Follow'
                            }
                        </div>
                    ) : null
                }
                <NavLink className="user-card__action link-yellow" to={`/user/${_cardId}`}>Page</NavLink>
                {
                    _id !== _cardId ? (
                        <NavLink className="user-card__action link-yellow" to={`/messages/?chat=${_cardId}`}>Message</NavLink>
                    ) : null
                }
            </div>
            <div className="user-card__info">
                <div className="user-card__info-item">
                    <div className="user-card__info-key">
                        {postsCount}
                    </div>
                    <div className="user-card__info-value">
                        Posts
                    </div>
                </div>
                <div className="user-card__info-item">
                    <div className="user-card__info-key">
                        {followersCount}
                    </div>
                    <div className="user-card__info-value">
                        Followers
                    </div>
                </div>
                <div className="user-card__info-item">
                    <div className="user-card__info-key">
                        {followingCount}
                    </div>
                    <div className="user-card__info-value">
                        Following
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

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(UserCard))
