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
        apiService.login(this.state.form).then(response => {
            const res = response.body;

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
        }).catch(e => {

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
            <div className="form-feedback">
                {message.text}
            </div>
        ) : null;

        return (
            <div className="container">
                <div className="signup">
                    <div className="row">
                        <div className="col s4 offset-s4 center">
                            <form className="form" onSubmit={this.login}>
                                <div className="form__title">
                                    Login
                                </div>
                                <div className="form__body">
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

                {/*<div className="row">*/}
                {/*    <div className="col-4">*/}
                {/*        <div className="mb-4">Login</div>*/}
                {/*        <form onSubmit={this.login}>*/}
                {/*            <div className="mb-3">*/}
                {/*                <div className="form-group">*/}
                {/*                    <input type="text" onChange={this.onInputChange} name="email" className="form-control" placeholder="Email" />*/}
                {/*                </div>*/}
                {/*                <div className="form-group">*/}
                {/*                    <input type="password" onChange={this.onInputChange} name="password" className="form-control" placeholder="Password" />*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*            {feedback}*/}
                {/*            <button type="submit" className="btn btn-primary">Sign in</button>*/}
                {/*        </form>*/}
                {/*    </div>*/}
                {/*</div>*/}
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
