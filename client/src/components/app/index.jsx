import React from 'react';
import {Route, Switch} from "react-router-dom";

import Cart from "../cart";
import Header from "../header";
import Home from "../home";
import Store from "../store";
import PrivateRoute from "../private-route";
import Login from "../login";
import Register from '../register';
import Messages from '../messages';
import Me from '../me';
import {withApiService} from "../hoc";
import {connect} from "react-redux";
import {sortMessagesList, updateMessageInList} from "../../store/actions/messageActions";
import {addChatMessage} from "../../store/actions/chatActions";
import {bindActionCreators} from "redux";

class App extends React.Component {
    componentDidMount() {
        if (this.props.user.auth) {
            this.longpoll();
        }
    }

    longpoll() {
        const {apiService, user, updateMessageInList, addChatMessage} = this.props;

        apiService.getRequest(`longpoll?id=${user.id}`).then(res => {
            // Got new message
            console.log(res); // res.message
            const {inChat, chatId} = this.props.chat;

            // интервал ожидания
            if (res.type === 'timeout') {
                this.longpoll();
                return;
            }

            if (inChat && chatId.toString() === res.senderId.toString()) {
                addChatMessage(res.message);
                apiService.updateChatTime(res.id, res.senderId);
            } else {
                window.M.toast({html: `<b>${res.message.name}</b>: ${res.message.text}`});
                updateMessageInList({id: res.senderId, updated: true, message: res.message});
            }

            // sortMessagesList({id: res.senderId});
            this.longpoll();
        }).catch(e => {
            console.log(e);
            // this.longpoll();
        })
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="content pt-3">
                    <div className="container">
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <PrivateRoute exact path="/cart" component={Cart}/>
                            <Route path="/store" component={Store} />
                            <PrivateRoute exact path="/me" component={Me}/>
                            <PrivateRoute exact path="/messages/" component={Messages}/>
                            <Route path="/login" component={Login} />
                            <Route path="/register" component={Register} />
                            <Route path="/test" render={() => {
                                return <h2>Test page</h2>
                            }} />
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        getNewMessage: state.messages.getNewMessage,
        user: state.user,
        chat: state.chat
    }
};

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({
        updateMessageInList,
        sortMessagesList,
        addChatMessage
    }, dispatch);
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(App))
