import React from "react";
import User from '../user';

const UserPage = (props) => {
    const userId = props.computedMatch.params.id;

    return <User userPageId={userId} isUserPage={true} {...props} />
};

export default UserPage;
