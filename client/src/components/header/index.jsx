import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import {actionUnauthorize} from "../../store/actions";
import './style.css'

import socket from "../../socket";

const Header = ({isAuthenticated, actionUnauthorize, user}) => {
    const logout = (e) => {
        e.preventDefault();
        socket.emit('leaveRoom', {id: user.id});
        actionUnauthorize();
    };

    const renderRight = () => {
        if (isAuthenticated) {
            return (
                <ul className="navbar-nav ml-3 right">
                    <li className="nav-item">
                        <NavLink onClick={logout} activeClassName='active' className="nav-link ml-auto" to="/logout">Logout</NavLink>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul id="nav-mobile" className="right hide-on-med-and-down">
                    <li className="nav-item">
                        <NavLink activeClassName='active' className="nav-link ml-auto" to="/login">Login</NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink activeClassName='active' className="nav-link ml-2" to="/register">Register</NavLink>
                    </li>
                </ul>
            )
        }
    };

    const items = [
        {exact: true, to: '/', name: 'Home', isAuth: false},
        {exact: true, to: '/me', name: 'Me', isAuth: true},
        {exact: true, to: '/followers', name: 'Followers', isAuth: true},
        {exact: false, to: '/store', name: 'Store', isAuth: false},
        {exact: false, to: '/messages/', name: 'Messages', isAuth: true},
    ];

    return (
        <header className="header">
            <nav>
                <div className="nav-wrapper">
                    <div className="container">
                        <div className="row">
                            <div className="col s12">
                                <Link className="navbar-brand left" to="/">Art's Store</Link>
                                <ul id="nav-mobile" className="left hide-on-med-and-down">
                                    {
                                        items.map((link, idx) => {
                                            if (!isAuthenticated && link.isAuth) {
                                                return null;
                                            }

                                            return (
                                                <li key={idx} className="nav-item">
                                                    <NavLink activeClassName='active' className="nav-link" exact={link.exact} to={link.to}>{link.name}</NavLink>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                                { renderRight() }
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {/*<nav className="navbar navbar-expand-lg navbar-dark bg-dark">*/}
            {/*    <Link className="navbar-brand" to="/">Art's Store</Link>*/}
            {/*    <ul className="navbar-nav ml-3 mr-auto">*/}
            {/*        {*/}
            {/*            items.map((link, idx) => {*/}
            {/*                if (!isAuthenticated && link.isAuth) {*/}
            {/*                    return null;*/}
            {/*                }*/}

            {/*                return (*/}
            {/*                    <li key={idx} className="nav-item">*/}
            {/*                        <NavLink activeClassName='active' className="nav-link" exact={link.exact} to={link.to}>{link.name}</NavLink>*/}
            {/*                    </li>*/}
            {/*                )*/}
            {/*            })*/}
            {/*        }*/}

            {/*        /!*<li className="nav-item ml-1">*!/*/}
            {/*        /!*    <NavLink activeClassName='active' className="nav-link" to="/cart">Cart</NavLink>*!/*/}
            {/*        /!*</li>*!/*/}
            {/*        /!*<li className="nav-item ml-1">*!/*/}
            {/*        /!*    <NavLink activeClassName='active' className="nav-link" to="/test">Test</NavLink>*!/*/}
            {/*        /!*</li>*!/*/}
            {/*    </ul>*/}
            {/*    { renderRight() }*/}
            {/*</nav>*/}
        </header>
    )
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.user.auth,
        user: state.user
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        actionUnauthorize: () => dispatch(actionUnauthorize())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
