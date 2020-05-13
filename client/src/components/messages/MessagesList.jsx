import React from "react";
import {withRouter} from 'react-router-dom'

const MessagesList = (props) => {
    const {messagesList, openChat} = props;

    return (
        <ul className="collection with-header">
            {messagesList.map((item, idx) => {
                return (
                    <li key={idx} className="collection-item">
                        <div className="message-item">
                            <div className="message-item__content">
                                <div className="message-item__avatar">
                                    <div className="message-item__avatar-icon"></div>
                                </div>
                                <div className="message-item__info">
                                    <div className="message-item__name"><strong>{item.name}</strong></div>
                                    <div className="message-item__text">{item.text}</div>
                                </div>
                            </div>
                            <div className="message-item__actions">
                                {item.updated ? (
                                    <button onClick={() => openChat(item.id)} className="btn btn-outline btn-danger btn-sm">
                                        <i className="fa fa-envelope-open" />
                                    </button>
                                ) : null}
                                <button onClick={() => openChat(item.id)} className="btn btn-outline btn-success btn-sm ml-3">
                                    <i className="fa fa-weixin" />
                                </button>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
};

export default withRouter(MessagesList)

