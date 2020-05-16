import React from 'react';
import {connect} from 'react-redux';
import {withApiService} from '../hoc';

class Register extends React.Component {
    state = {
        form: {
            name: '',
            email: '',
            password: ''
        },
        message: {
            color: 'red',
            text: ''
        }
    };

    register = (e) => {
        e.preventDefault();
        const {apiService} = this.props;
        apiService.register(this.state.form).then(res => {
            const color = !res.errors ? 'green' : 'red';
            if (res.errors) {
                this.setState({
                    message: {color, text: res.message}
                });
            } else {
                this.setState({
                    message: {color, text: res.message},
                    form: {name: '', email: '', password: ''}
                });
            }
        }).catch(e => {
            console.log(e);
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
                        <h3 className="mb-4">Register</h3>
                        <form onSubmit={this.register}>
                            <div className="mb-3">
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
                            <button type="submit" className="btn btn-primary">Register</button>
                        </form>
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
