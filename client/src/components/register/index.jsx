import React from 'react'
import {connect} from 'react-redux'
import {withApiService} from '../hoc'
import cn from 'classnames'

import './style.css'

class Register extends React.Component {
    state = {
        form: {
            name: '',
            email: '',
            password: ''
        },
        message: {
            ok: false,
            text: ''
        }
    };

    register = (e) => {
        e.preventDefault();
        const {apiService} = this.props;
        apiService.register(this.state.form).then(response => {
            const res = response.body;

            if (res.errors) {
                this.setState({
                    message: {ok: false, text: res.message}
                });
            } else {
                this.setState({
                    message: {ok: true, text: res.message},
                    form: {name: '', email: '', password: ''}
                });
            }
        }).catch(e => {
            // console.log(e);
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

        const feedbackClasses = cn({
            'form-feedback': true,
            'good': this.state.message.ok
        });

        const feedback = message.text ? (
            <div className={feedbackClasses}>
                {message.text}
            </div>
        ) : null;

        return (
            <div className="container">
                <div className="signup">
                    <div className="row">
                        <div className="col s4 offset-s4 center">
                            <form className="form" onSubmit={this.register}>
                                <div className="form__title">
                                    Sign up
                                </div>
                                <div className="form__body">
                                    <div className="form-group">
                                        <input type="text" onChange={this.onInputChange} name="name" className="form-control" placeholder="Name" value={this.state.form.name} />
                                    </div>
                                    <div className="form-group">
                                        <input type="text" onChange={this.onInputChange} name="email" className="form-control" placeholder="Email" value={this.state.form.email} />
                                    </div>
                                    <div className="form-group">
                                        <input type="password" onChange={this.onInputChange} name="password" className="form-control" placeholder="Password" value={this.state.form.password} />
                                    </div>
                                </div>
                                {feedback}
                                <button type="submit" className="btn btn-primary">Sign up</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {}
};

const mapDispatchToProps = (dispatch) => {
    return {
        checkAuth: () => {}
    }
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(Register));
