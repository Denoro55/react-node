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
import Following from '../following';
import UserPage from "../hoc/userPage";
import MePage from '../hoc/mePage';
import Search from '../search';

import {withApiService} from "../hoc";
import {connect} from "react-redux";
import {sortMessagesList, updateMessageInList} from "../../store/actions/messageActions";
import {addChatMessage} from "../../store/actions/chatActions";
import {actionUpdateUserCounters} from '../../store/actions'
import {bindActionCreators} from "redux";

import socket from "../../socket";
import {getUserData} from "../../store/actions";

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
        const {apiService, updateMessageInList, addChatMessage, getUserData, actionUpdateUserCounters} = this.props;

        // setInterval(() => {
        //     getUserData(apiService, this.getUser().token);
        // }, 5000);

        // messages from me and others
        socket.on('getMessage', (data) => {
            console.log('get data', data);

            const user = this.getUser();
            const {inChat, chatId} = this.props.chat;
            let mine = data.fromId.toString() === user.id.toString();

            // update message list
            const message = {...data.message};
            // if mine
            if (mine) {
                message.name = data.companion.name;
                message.avatarUrl = data.companion.avatarUrl;

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

        socket.on('follow', (data) => {
            const {isFollowing} = data;
            const num = isFollowing ? 1 : -1;

            actionUpdateUserCounters({
                followersCount: this.getUser().followersCount + num
            })
        });

        socket.on('sendPostData', (data) => {
            const {imageUrl} = data.post;
            const imageCount = imageUrl ? 1 : 0;

            actionUpdateUserCounters({
                postsCount: this.getUser().postsCount + 1,
                imagesCount: this.getUser().imagesCount + imageCount
            })
        })
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
                        <PrivateRoute exact path="/following" component={Following}/>
                        <PrivateRoute exact path="/messages/" component={Messages}/>
                        <PrivateRoute exact path="/search" component={Search}/>
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
    return {
        getUserData: (apiSevice, token) => dispatch(getUserData(apiSevice, token)()),
        ...bindActionCreators({
            updateMessageInList,
            sortMessagesList,
            addChatMessage,
            actionUpdateUserCounters
        }, dispatch)
    }
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(App))
