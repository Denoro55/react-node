import React from 'react'
import {Redirect} from 'react-router-dom'

class Store extends React.Component {
    componentDidMount() {
        console.log(this.props);
    }

    render() {
        return (
            <Redirect to="/"/>
        )
    }
}

export default Store;
