import React, {useContext} from "react";
import {withRouter} from 'react-router-dom'
import VariableProvider from "../context/vars";

const MessagesList = (props) => {
    const {messagesList, openChat} = props;

    const {publicPath} = useContext(VariableProvider);

    return (
        <ul className="collection with-header">
            {messagesList.map((item, idx) => {
                return (
                    <li key={idx} className="collection-item">
                        <div className="message-item">
                            <div className="message-item__content">
                                <div className="message-item__avatar">
                                    <div style={{backgroundImage: `url(${publicPath}${item.avatarUrl})`}} className="message-item__avatar-icon">

                                    </div>
                                </div>
                                <div className="message-item__info">
                                    <div className="message-item__name"><strong>{item.name}</strong></div>
                                    <div className="message-item__text">{item.text}</div>
                                </div>
                            </div>
                            <div className="message-item__actions">
                                {item.updated ? (
                                    <div className="message-item__action">
                                        <button onClick={() => openChat(item.id)} className="btn btn-outline btn-danger btn-sm">
                                            <i className="fa fa-envelope-open" />
                                        </button>
                                    </div>
                                ) : null}
                                <div className="message-item__action">
                                    <button onClick={() => openChat(item.id)} className="btn btn-outline btn-success btn-sm">
                                        <i className="fa fa-weixin" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </li>
                )
            })}
        </ul>
    )
};

export default withRouter(MessagesList)

