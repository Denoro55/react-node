import React from "react";
import {Route, Redirect} from 'react-router-dom';
import {connect} from 'react-redux'

const PrivateRoute = (props) => {
    return (
        <Route>
            { props.auth ? props.children : <Redirect to="/login" />}
        </Route>
    )
};

const mapStateToProps = (state) => {
    return {
        auth: state.auth
    }
};

export default connect(mapStateToProps)(PrivateRoute);
