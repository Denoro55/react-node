import React, {useEffect, useRef, useState} from "react";
import Spinner from "../spinner";
import {connect, useSelector} from "react-redux";
import {bindActionCreators} from "redux";
import {fetchChat, actionUpdateChatStatus, actionSendMessage} from "../../store/actions/chatActions";
import {withApiService} from "../hoc";

const Chat = (props) => {
    const {backToMessages, chatLoading, user,
        companionId, fetchChat, actionUpdateChatStatus, actionSendMessage} = props;

    const [message, setMessage] = useState('');
    const chatMessages = useSelector(state => state.chat.messages);
    const companion = useSelector(state => state.chat.companion);
    const listContainer = useRef(null);

    useEffect(() => {
        actionUpdateChatStatus({inChat: true, chatId: companionId});
        fetchChat(user.id, companionId);

        return () => {
            actionUpdateChatStatus({inChat: false, chatId: null});
        }
    }, []);

    useEffect(() => {
        listContainer.current.scrollTop = listContainer.current.scrollHeight;
    }, [chatMessages]);

    const sendMessage = (text, companion) => {
        const newMessage = {name: user.name, text};
        actionSendMessage(companion, user, newMessage);
    };

    const submitForm = (e) => {
        e.preventDefault();
        const companionData = {
            id: companionId,
            name: companion.name
        };
        sendMessage(message, companionData);
        setMessage('');
    };

    const renderList = () => {
        return (
            <div ref={listContainer} className="chat__list">
                { chatMessages.map((msg, idx) => {
                    return (
                        <div key={idx} className="chat__item">
                            <strong>{msg.name}</strong>: {msg.text}
                        </div>
                    )
                })}
            </div>
        )
    };

    return (
        <div className="chat">
            <div className="chat__back">
                <button onClick={backToMessages} className="btn btn-primary">Back</button>
            </div>
            <div className="chat__block">
                <div className="chat__left">
                    { chatLoading ? <Spinner /> : renderList() }
                    <div className="chat__control">
                        <form onSubmit={submitForm} className="chat-control">
                            <div className="chat-control__left">
                                <input onChange={(e) => setMessage(e.target.value)} type="text" className="form-control" value={message} />
                            </div>
                            <div className="chat-control__right">
                                <button className="btn btn-success">Send</button>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="chat__right">
                    <div className="chat__companion">
                        {companion.name || <Spinner /> }
                    </div>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    return {
        user: state.user
    }
};

const mapDispatchToProps = (dispatch, {apiService}) => {
    return bindActionCreators({
        fetchChat: fetchChat(apiService),
        actionUpdateChatStatus,
        actionSendMessage: actionSendMessage(apiService)
    }, dispatch);
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(Chat))
