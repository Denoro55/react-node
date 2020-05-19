import React, {useState} from "react";
import User from '../user';
import {connect, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {actionUpdateUserCounters} from "../../store/actions";

const MePage = (props) => {
    const { actionUpdateUserCounters } = props;
    const user = useSelector(state => state.user);
    const avatarUrl = useSelector(state => state.user.avatarUrl);

    const getCounters = () => {
        return {
            followersCount: user.followersCount,
            followingCount: user.followingCount,
            imagesCount: user.imagesCount,
            postsCount: user.postsCount
        }
    };

    const profileCounters = getCounters();

    const updateProfileCounters = (params) => {
        actionUpdateUserCounters(params);
    };

    return <User
        avatarUrl={avatarUrl}
        profileCounters={profileCounters}
        updateProfileCounters={updateProfileCounters}
        {...props}
    />
};

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        actionUpdateUserCounters
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(MePage)
