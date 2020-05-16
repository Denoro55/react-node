import React from "react";
import User from '../user';
import {connect, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {actionUpdateUserData} from "../../store/actions";

const MePage = (props) => {
    const {actionUpdateUserData} = props;

    const user = useSelector(state => state.user);

    const avatarUrl = useSelector(state => state.user.avatarUrl);

    const profileCounters = {
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        imagesCount: user.imagesCount,
        postsCount: user.postsCount
    };

    const updateProfileCounters = (params) => {
        actionUpdateUserData(params);
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
        actionUpdateUserData
    }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(MePage)
