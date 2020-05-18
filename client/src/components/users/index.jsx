import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {useSelector} from "react-redux";
import {withApiService} from '../hoc';
import UserCard from "../card";
import Spinner from "../spinner";

import './style.css'

const Users = (props) => {
    const {fetchFunc} = props;
    const user = useSelector(state => state.user);
    const {id} = user;
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = () => {
        setLoading(true);

        fetchFunc(user.id).then(res => {
            setUsers(res.body.users);
            setLoading(false);
        }).catch((e) => {

        })
    };

    const updateUser = (followerId, params) => {
        setUsers((state) => {
            const index = state.findIndex((item) => item._id === followerId);
            const newItem = {
                ...state[index],
                ...params
            };

            return [...state.slice(0, index), newItem, ...state.slice(index + 1)];
        });
    };

    useEffect(() => {
        fetchUsers();
    } ,[fetchFunc]);

    return (
        <div className="users">
            {
                loading ? (
                    <Spinner/>
                ) : (
                    <div className="users__list">
                        {
                            users.map(f => {
                                return (
                                    <div key={f._id} className="users__item">
                                        <UserCard
                                            name={f.name}
                                            followersCount={f.followersCount}
                                            followingCount={f.followingCount}
                                            postsCount={f.postsCount}
                                            avatarUrl={f.avatarUrl}
                                            _id={id}
                                            _cardId={f._id}
                                            isFollowing={f.isFollowing}
                                            updateUser={updateUser}
                                        />
                                    </div>
                                )
                            })
                        }
                    </div>
                )
            }
        </div>
    )
};

export default withApiService(connect()(Users));
