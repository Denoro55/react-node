import React from 'react';
import {Route, Switch, Redirect} from "react-router-dom";

import Cart from "../cart";
import Header from "../header";
import Home from "../home";
import Store from "../store";
import PrivateRoute from "../private-route";
import Login from "../login";
import Register from '../register';
import Messages from '../messages';
import Followers from '../followers';
import UserPage from "../hoc/userPage";
import MePage from '../hoc/mePage';

import {withApiService} from "../hoc";
import {connect} from "react-redux";
import {sortMessagesList, updateMessageInList} from "../../store/actions/messageActions";
import {addChatMessage} from "../../store/actions/chatActions";
import {bindActionCreators} from "redux";

import socket from "../../socket";

class App extends React.Component {
    componentDidUpdate(prevProps, prevState, snapshot) {
        const {apiService} = this.props;
        const token = this.props.user.token;

        if (prevProps.user.token !== token) {
            apiService.setToken(token);
        }
    }

    getUser() {
        const { user } = this.props;
        return user;
    }

    componentDidMount() {
        const {apiService, updateMessageInList, addChatMessage} = this.props;

        fetch('/api/test').then(res => {
            console.log(res)
        });

        // messages from me and others
        socket.on('getMessage', (data) => {
            const user = this.getUser();
            const {inChat, chatId} = this.props.chat;
            let mine = data.fromId.toString() === user.id.toString();

            // update message list
            const message = {...data.message};
            // if mine
            if (mine) {
                message.name = data.companion.name;
                updateMessageInList({id: data.toId, updated: false, message, sort: true});
            }

            if (inChat && (chatId.toString() === data.toId.toString() || chatId.toString() === data.fromId.toString())) {
                addChatMessage(data.message);

                if (!mine) {
                    apiService.updateChatTime(user.id, data.fromId, data.date);
                    updateMessageInList({id: data.fromId, updated: false, message, sort: true});
                }
            } else {
                if (!mine) {
                    window.M.toast({html: `<b>${data.message.name}</b>: ${data.message.text}`});
                    updateMessageInList({id: data.fromId, updated: true, message, sort: true});
                }
            }
        });
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="content pt-3">
                    <Switch>
                        <Route path="/" exact component={Home} />
                        <PrivateRoute exact path="/cart" component={Cart}/>
                        <Route path="/store" component={Store} />
                        <PrivateRoute exact path="/me" component={MePage}/>
                        <PrivateRoute exact path="/followers" component={Followers}/>
                        <PrivateRoute exact path="/messages/" component={Messages}/>
                        <Route path="/login" component={Login} />
                        <Route path="/register" component={Register} />
                        <Route path="/test" render={() => {
                            return <h2>Test page</h2>
                        }} />
                        <PrivateRoute path="/user/:id" component={UserPage}/>
                        <Redirect to="/" />
                    </Switch>
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
