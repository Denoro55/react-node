import React from 'react';
import {connect} from 'react-redux';
import {withApiService} from '../hoc';
import {actionAuthorize} from "../../store/actions";

class Login extends React.Component {
    state = {
        form: {
            email: '',
            password: ''
        }
    };

    login = (e) => {
        e.preventDefault();
        const {apiService, actionAuthorize} = this.props;
        apiService.login(this.state.form).then(res => {
            const token = res.token;
            if (token) {
                actionAuthorize({auth: true, token});
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
        return (
            <div>
                <h3 className="mb-4">Login</h3>
                <form onSubmit={this.login}>
                    <div className="form-row mb-3">
                        <div className="col">
                            <input type="text" onChange={this.onInputChange} name="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="col">
                            <input type="password" onChange={this.onInputChange} name="password" className="form-control" placeholder="Password" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Sign in</button>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
        actionAuthorize: (payload) => dispatch(actionAuthorize(payload))
    }
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(Login));
