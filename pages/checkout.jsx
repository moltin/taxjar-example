import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Billing from '../components/checkout/billing'
import Cart from '../components/checkout/cart'
import { loadCart } from '../store'

class CheckoutPage extends Component {
  constructor(props) {
    super(props)
    const { cartId, dispatch } = props
    dispatch(loadCart(cartId))
  }

  render() {
    const { cart, cartItems } = this.props
    return (
      <div className="row">
        <div className="col-md-4 order-md-2 mb-4">
          <span className="text-muted">Your cart</span>
          <Cart id="cart" items={cartItems} cart={cart} />
        </div>
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Billing address</h4>
          <Billing id="billing" />
        </div>
      </div>
    )
  }
}

CheckoutPage.propTypes = {
  cart: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  cartId: PropTypes.string,
  cartItems: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  dispatch: PropTypes.func.isRequired,
}

CheckoutPage.defaultProps = {
  cart: {},
  cartId: '',
  cartItems: {},
}

const mapStateToProps = state => ({
  cart: state.cart,
  cartId: state.cartId,
  cartItems: state.cartItems,
})

export default connect(mapStateToProps)(CheckoutPage)
