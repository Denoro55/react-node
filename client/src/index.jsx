import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from "react-router-dom";
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import {ApiService} from "./service";
import './style.css'

import store from "./store";

import {ApiServiceProvider} from "./components/context/apiService";
import VariablesProvider from "./components/context/vars";
import {getUserData} from "./store/actions";

import socket from "./socket";

const apiService = new ApiService();
const token = localStorage.getItem('userData');
apiService.setToken(token);

// window.M.toast({html: 'I am a toast!'});
console.log(process.env, process.env.CLIENT_SOCKET_PORT);

// sockets
socket.on('connect', function() {
    if (token) {
        store.dispatch(getUserData(apiService, token)()).then(e => {
            renderDOM();
            const id = store.getState().user.id;
            socket.emit('connected', {id});
        })
    } else {
        renderDOM();
    }
});

function renderDOM() {
    ReactDOM.render(
        <React.StrictMode>
            <Provider store={store}>
                <ApiServiceProvider value={apiService}>
                    <VariablesProvider.Provider value={{publicPath: '/public/images/'}}>
                        <Router>
                            <App/>
                        </Router>
                    </VariablesProvider.Provider>
                </ApiServiceProvider>
            </Provider>
        </React.StrictMode>,
        document.getElementById('root')
    );
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
