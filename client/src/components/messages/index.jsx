import React from 'react'
import queryString  from 'query-string'
import {Redirect} from 'react-router-dom'

import Messages from './messages'
import {useSelector} from "react-redux";

const Wrapper = (props) => {
    const userId = useSelector(state => state.user.id);
    const queryParams = queryString.parse(props.location.search);

    let queryChatId = queryParams.chat;

    if (queryChatId) {
        if (queryChatId.toString() === userId.toString()) {
            return <Redirect to="/me" />
        }
    }

    return <Messages queryChatId={queryChatId} />
};

export default Wrapper
