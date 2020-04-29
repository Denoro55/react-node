import React from 'react';
import {Route, Switch} from "react-router-dom";

import Cart from "../cart";
import Header from "../header";
import Home from "../home";
import Store from "../store";
import PrivateRoute from "../private-route";
import Login from "../login"
import Register from '../register'

class Index extends React.Component {
    componentDidMount() {
        // fetch("http://localhost:9000/api/foo").then(res => res.json())
        //     .then(res => {
        //         console.log(res);
        //     })
    }

    render() {
        return (
            <div className="App">
                <Header />
                <div className="content pt-3">
                    <div className="container">
                        <Switch>
                            <Route path="/" exact component={Home} />
                            <PrivateRoute path="/cart">
                                <Cart />
                            </PrivateRoute>
                            <PrivateRoute path="/store">
                                <Store />
                            </PrivateRoute>
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

export default Index;
