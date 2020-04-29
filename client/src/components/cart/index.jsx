import React from 'react'
import {Redirect} from 'react-router-dom'

class Cart extends React.Component {
    componentDidMount() {
        console.log(this.props);
    }

    render() {
        return (
            <div>cart</div>
        )
    }
}

export default Cart;
