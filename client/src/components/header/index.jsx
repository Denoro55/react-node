import React from 'react'
import {Link, NavLink} from 'react-router-dom'
import {connect} from 'react-redux'
import {actionUnauthorize} from "../../store/actions";

const Header = ({isAuthenticated, actionUnauthorize}) => {
    const logout = (e) => {
        e.preventDefault();
        actionUnauthorize();
    };

    const renderRight = () => {
        if (isAuthenticated) {
            return (
                <ul className="navbar-nav ml-3">
                    <li className="nav-item">
                        <NavLink onClick={logout} activeClassName='active' className="nav-link ml-auto" to="/logout">Logout</NavLink>
                    </li>
                </ul>
            )
        } else {
            return (
                <ul className="navbar-nav ml-3">
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

    return (
        <header className="header">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                <Link className="navbar-brand" to="/">React-Node App</Link>
                <ul className="navbar-nav ml-3 mr-auto">
                    <li className="nav-item">
                        <NavLink activeClassName='active' className="nav-link" exact to="/">Home</NavLink>
                    </li>
                    <li className="nav-item ml-1">
                        <NavLink activeClassName='active' className="nav-link" to="/store">Store</NavLink>
                    </li>
                    <li className="nav-item ml-1">
                        <NavLink activeClassName='active' className="nav-link" to="/cart">Cart</NavLink>
                    </li>
                    <li className="nav-item ml-1">
                        <NavLink activeClassName='active' className="nav-link" to="/test">Test</NavLink>
                    </li>
                </ul>
                { renderRight() }
            </nav>
        </header>
    )
};

const mapStateToProps = (state) => {
    return {
        isAuthenticated: state.user.auth
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        actionUnauthorize: () => dispatch(actionUnauthorize())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Header)
