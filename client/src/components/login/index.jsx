import React from 'react';
import {connect} from 'react-redux';
import {withApiService} from '../hoc';
import {actionAuthorize, getUserData} from "../../store/actions";

import socket from "../../socket";

class Login extends React.Component {
    state = {
        form: {
            email: '',
            password: ''
        },
        message: {
            color: 'red',
            text: ''
        }
    };

    login = (e) => {
        e.preventDefault();
        const {apiService, actionAuthorize, actionGetUserData} = this.props;
        apiService.login(this.state.form).then(res => {
            if (res.errors) {
                this.setState({
                    message: {color: 'red', text: res.message}
                });
            } else {
                const token = res.token;
                if (token) {
                    actionAuthorize({auth: true, token});
                    actionGetUserData(token).then((e) => {
                        socket.emit('connected', {id: e.payload.id});
                        this.props.history.push('/me');
                    });
                }
            }
        })
    };

    onInputChange = (e) => {
        this.setState({
            form: {
                ...this.state.form,
                [e.target.name]: e.target.value
            }
        });
    };

    render() {
        const {message} = this.state;

        const feedback = message.text ? (
            <div className="mb-3" style={{color: message.color}}>
                {message.text}
            </div>
        ) : null;

        return (
            <div className="container">
                <div className="row">
                    <div className="col-4">
                        <h3 className="mb-4">Login</h3>
                        <form onSubmit={this.login}>
                            <div className="mb-3">
                                <div className="form-group">
                                    <input type="text" onChange={this.onInputChange} name="email" className="form-control" placeholder="Email" />
                                </div>
                                <div className="form-group">
                                    <input type="password" onChange={this.onInputChange} name="password" className="form-control" placeholder="Password" />
                                </div>
                            </div>
                            {feedback}
                            <button type="submit" className="btn btn-primary">Sign in</button>
                        </form>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.user.token
    }
};

const mapDispatchToProps = (dispatch, {apiService, token}) => {
    return {
        actionGetUserData: (token) => dispatch(getUserData(apiService, token)()),
        actionAuthorize: (payload) => dispatch(actionAuthorize(payload))
    }
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(Login));
