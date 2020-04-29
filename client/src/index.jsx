import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import {BrowserRouter as Router} from "react-router-dom";
import App from './components/app';
import * as serviceWorker from './serviceWorker';
import {ApiService} from "./service";

import store from "./store";

import {ApiServiceProvider} from "./components/context/apiService";
import {getUserData} from "./store/actions";

const apiService = new ApiService();

// store.dispatch(authCheck());

const token = localStorage.getItem('userData');

// const {user} = store.getState();

if (token) {
    // apiService.setAuthorizationHeader(user.token);
    store.dispatch(getUserData(apiService, token)())
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <ApiServiceProvider value={apiService}>
                <Router>
                    <App/>
                </Router>
            </ApiServiceProvider>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
