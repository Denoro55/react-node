import React from "react";
import {Redirect} from 'react-router-dom'
import {useSelector} from "react-redux";

const withoutOwner = (Wrapped) => {
    return (props) => {
        const user = useSelector(state => state.user);
        const pageId = props.computedMatch.params.id;

        if (pageId && user.id.toString() === pageId.toString()) {
            return <Redirect to="/me" />
        }

        return <Wrapped {...props}/>
    }
};

export default withoutOwner
