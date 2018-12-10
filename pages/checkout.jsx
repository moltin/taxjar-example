import React, { Component } from 'react'
import { connect } from 'react-redux'
// import Link from 'next/link'

import CartItem from '../components/cart-item'
import { assignTax } from '../store'

class CheckoutPage extends Component {
  componentDidMount() {
    // TODO: Render tax price
    const { dispatch, cartItems } = this.props
    dispatch(assignTax(cartItems))
  }

  render() {
    const { cartItems } = this.props
    return (
      <div>
        <h1>Whatever</h1>
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
              <th scope="col">Tax</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => <CartItem key={item.id} {...item} />)}
          </tbody>
        </table>
        {/* <Link href="/checkout"><button type="button" href="/checkout" className="btn btn-primary">Checkout</button></Link> */}
        <a className="btn btn-primary" href="/checkout" role="button">Checkout</a>
      </div>
    )
  }
}

const mapStateToProps = state => ({ cartItems: state.cartItems })
export default connect(mapStateToProps)(CheckoutPage)
