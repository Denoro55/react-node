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
        : <Chat
            backToMessages={backToMessages}
            companionId={queryParams.chat}
            chatLoading={chatLoading}
        />;

    return (
        <div className="container">
            <div className="messages">
                { messagesLoading ? <Spinner/> : (
                    <div className="messages__left">
                        {currentContent}
                    </div>
                )}
            </div>
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
