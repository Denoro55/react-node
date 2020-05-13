import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import {withApiService} from '../hoc'
import MessagesList from './MessagesList';
import Chat from "./Chat";
import {useSelector} from "react-redux";
import queryString  from 'query-string';
import {withRouter} from 'react-router-dom';

import './style.css'
import {actionFetchMessages, updateMessagesList} from "../../store/actions/messageActions";
import {bindActionCreators} from "redux";
import Spinner from "../spinner";

const Messages = (props) => {
    const {user, actionFetchMessages} = props;
    const queryParams = queryString.parse(props.location.search);

    let showChat = false;
    if (queryParams.chat) {
        showChat = true;
    }

    // const initialList = [
    //     {name: 'Den', id: '5eaa9308d326261eccf1e564', updated: false},
    //     {name: 'Max', id: '5eaacfcddeeb382da4898245', updated: true},
    //     {name: 'Bob', id: '5eaad057a291b831b8822066', updated: false}
    // ];

    const [chat, setChat] = useState(showChat);
    const chatLoading = useSelector((state) => state.chat.loading);
    const messagesLoading = useSelector((state) => state.messages.loading);
    const messagesList = useSelector((state) => state.messages.messages);

    useEffect(() => {
        actionFetchMessages(user.id);
    }, []);

    const openChat = (receiverId) => {
        setChat({show: true, receiverId});
        props.history.push(`?chat=${receiverId}`);
    };

    const backToMessages = () => {
        props.history.push(`./`);
        setChat(false);
    };

    const currentContent = !chat ?
        <MessagesList
            openChat={(id) => openChat(id)}
            messagesList={messagesList}
        />
        : <Chat backToMessages={backToMessages}
                companionId={queryParams.chat}
                chatLoading={chatLoading}
        />;

    return (
        <div className="container">
            <h3 className="mb-4">Messages</h3>
            { messagesLoading ? <Spinner/> : (
                <div className="messages">
                    <div className="messages__left">
                        {currentContent}
                    </div>
                </div>
            )}
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.user,
        messages: state.messages
    }
};

const mapDispatchToProps = (dispatch, {apiService}) => {
    return bindActionCreators({
        actionFetchMessages: actionFetchMessages(apiService),
        updateMessagesList
    }, dispatch);
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(withRouter(Messages)))
