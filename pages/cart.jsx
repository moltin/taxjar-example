import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Link from 'next/link'

import CartItem from '../components/cart-item'
import { loadProducts } from '../store'

class CartPage extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(loadProducts())
  }

  render() {
    const { cartItems } = this.props

    if (cartItems.length === 0) {
      return (
        <div className="alert alert-secondary" role="alert">
          <h4 className="alert-heading">Your Cart is Empty!</h4>
          <p>Please add some products and then you can checkout</p>
        </div>
      )
    }

    return (
      <div>
        <h4 className="d-flex justify-content-between align-items-center mb-3">
          <span className="text-muted">Your cart</span>
          <span className="badge badge-secondary badge-pill">{cartItems.length}</span>
        </h4>
        <table className="table table-bordered">
          <thead className="thead-light">
            <tr>
              <th scope="col" style={{ width: '16.66%' }} />
              <th scope="col">Product</th>
              <th scope="col">Quantity</th>
              <th scope="col">Price</th>
              <th scope="col">&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => <CartItem key={item.id} {...item} />)}
          </tbody>
        </table>
        <a className="btn btn-success float-right" href="/checkout" role="button">Checkout</a>
      </div>
    )
  }
}

const mapStateToProps = state => ({ cartItems: state.cartItems })
export default connect(mapStateToProps)(CartPage)
