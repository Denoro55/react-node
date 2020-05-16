import React, {useState} from "react";
import User from '../user';

const UserPage = (props) => {
    const userId = props.computedMatch.params.id;

    const [avatarUrl, setAvatarUrl] = useState(null);

    const [profileCounters, setProfileCounters] = useState({});

    const updateProfileCounters = (params) => {
        setProfileCounters((state) => {
            return {
                ...state,
                ...params
            }
        });
    };

    return <User
        setAvatarUrl={setAvatarUrl}
        avatarUrl={avatarUrl}
        userPageId={userId}
        profileCounters={profileCounters}
        updateProfileCounters={updateProfileCounters}
        isUserPage={true} {...props}
    />
};

export default UserPage;
