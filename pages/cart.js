import React, { Component } from 'react'
import { connect } from 'react-redux'

import CartItem from '../components/cart-item'
import { loadProducts } from '../store'

class CartPage extends Component {

    componentDidMount() {
        this.props.dispatch(loadProducts())
    }

    render() {
        const { cartItems } = this.props
        return <div>
            <h4 class="d-flex justify-content-between align-items-center mb-3">
                <span class="text-muted">Your cart</span>
                <span class="badge badge-secondary badge-pill">{cartItems.length}</span>
            </h4>
            <table class="table table-bordered">
                <thead class="thead-light">
                    <tr>
                        <th scope="col" style={{ width: '16.66%' }}></th>
                        <th scope="col">Product</th>
                        <th scope="col">Quantity</th>
                        <th scope="col">Price</th>
                    </tr>
                </thead>
                <tbody>
                    {cartItems.map(item => <CartItem item={item} {...cartItems} />)}
                </tbody>
            </table>
        </div>
    }
}

const mapStateToProps = (state) => ({ cartItems: state.cartItems })
export default connect(mapStateToProps)(CartPage)
