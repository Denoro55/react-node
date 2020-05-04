import React from "react"
import {Route, Redirect} from 'react-router-dom'
import {connect} from 'react-redux'

const PrivateRoute = ({component: ChildComponent, auth, ...rest}) => {
    return (
        <Route>
            { auth ? <ChildComponent {...rest} /> : <Redirect to="/login" />}
        </Route>
    )
};

const mapStateToProps = (state) => {
    return {
        auth: state.user.auth
    }
};

export default connect(mapStateToProps)(PrivateRoute);
