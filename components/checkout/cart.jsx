import React, { Component } from 'react'
import { connect } from 'react-redux'

import CartItem from './cart-item'

class CheckoutPageCart extends Component {
  render() {
    const { cart, cartItems } = this.props
    const cartPriceWithoutTax = () => {
      if (typeof cart.meta !== 'undefined') {
        return (
          <li className="list-group-item d-flex justify-content-between">
            <span>Total (exc tax)</span>
            <strong>{cart.meta.display_price.without_tax.formatted}</strong>
          </li>
        )
      }
      return ''
    }
    const cartPriceWithTax = () => {
      if (typeof cart.meta !== 'undefined') {
        return (
          <li className="list-group-item d-flex justify-content-between">
            <span>Total (inc tax)</span>
            <strong>TBC</strong>
          </li>
        )
      }
      return ''
    }
    return (
      <ul className="list-group mb-3">
        {cartItems.map(item => <CartItem key={item.id} {...item} />)}
        {cartPriceWithoutTax()}
        {cartPriceWithTax()}
      </ul>
    )
  }
}

const mapStateToProps = state => ({
  cartItems: state.cartItems,
  cart: state.cart,
})

export default connect(mapStateToProps)(CheckoutPageCart)
