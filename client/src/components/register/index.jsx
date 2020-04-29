import React from 'react';
import {connect} from 'react-redux';
import {withApiService} from '../hoc';

class Register extends React.Component {
    state = {
        form: {
            name: '',
            email: '',
            password: ''
        }
    };

    register = (e) => {
        e.preventDefault();
        const {apiService} = this.props;
        apiService.register(this.state.form).then(e => {
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
        return (
            <div>
                <h3 className="mb-4">Register</h3>
                <form onSubmit={this.register}>
                    <div className="form-row mb-3">
                        <div className="col">
                            <input type="text" onChange={this.onInputChange} name="name" className="form-control" placeholder="Name" />
                        </div>
                        <div className="col">
                            <input type="text" onChange={this.onInputChange} name="email" className="form-control" placeholder="Email" />
                        </div>
                        <div className="col">
                            <input type="password" onChange={this.onInputChange} name="password" className="form-control" placeholder="Password" />
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary">Register</button>
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
        checkAuth: () => {}
    }
};

export default withApiService(connect(mapStateToProps, mapDispatchToProps)(Register));
