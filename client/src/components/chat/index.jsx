import React, {useEffect, useState} from "react";
import Spinner from "../spinner";
import {withRouter} from 'react-router-dom'

import './style.css'

const Chat = (props) => {
    const {backToMessages, sendMessage, chatMessages, messagerLoading} = props;

    console.log(props);

    const params = props.computedMatch.params;
    console.log(params);

    useEffect(() => {

    }, []);

    return <div>Chat</div>

    // const [message, setMessage] = useState('');
    //
    // const submitForm = (e) => {
    //     e.preventDefault();
    //     sendMessage(message);
    //     setMessage('');
    // };
    //
    // const renderList = () => {
    //     return (
    //         <div className="messager__list">
    //             { chatMessages.map((msg, idx) => {
    //                 return (
    //                     <div key={idx} className="messager__item">
    //                         <strong>{msg.name}</strong>: {msg.text}
    //                     </div>
    //                 )
    //             })}
    //         </div>
    //     )
    // };

    // return (
    //     <div className="chat">
    //         <div className="chat__back">
    //             <button onClick={() => {}} className="btn btn-primary">Back</button>
    //         </div>
    //         <div className="chat__block">
    //             { messagerLoading ? <Spinner /> : renderList() }
    //             <div className="chat__control">
    //                 <form onSubmit={submitForm} className="chat-control">
    //                     <div className="chat-control__left">
    //                         <input onChange={(e) => setMessage(e.target.value)} type="text" className="form-control" value={message} />
    //                     </div>
    //                     <div className="chat-control__right">
    //                         <button className="btn btn-success">Send</button>
    //                     </div>
    //                 </form>
    //             </div>
    //         </div>
    //     </div>
    // )
};

export default withRouter(Chat);
