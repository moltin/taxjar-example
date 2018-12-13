import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Router from 'next/router'

import Billing from '../components/checkout/billing'
import Cart from '../components/checkout/cart'
import {
  loadCart,
  loadCartItems,
  updateTaxes,
  updateTaxState,
} from '../store'

class CheckoutPage extends Component {
  constructor(props) {
    super(props)
    const { cartId, dispatch } = props
    dispatch(loadCart(cartId))
  }

  componentDidMount() {
    const { cartItems } = this.props
    if (cartItems.length === 0) {
      Router.push('/')
    }
    return ''
  }

  render() {
    const knownAddresses = {
      CA: {
        city: 'Los Angeles',
        state: 'CA',
        stateLong: 'California (Los Angeles)',
        country: 'US',
        zip: '90071',
      },
      NY: {
        city: 'Mahopac',
        state: 'NY',
        stateLong: 'New York (Mahopac)',
        country: 'US',
        zip: '10541',
      },
      WA: {
        city: 'Spokane',
        state: 'WA',
        stateLong: 'Washington (Spokane)',
        country: 'US',
        zip: '99201',
      },
    }
    const { cart, cartItems } = this.props
    let { taxState } = this.props

    const updateAddressHandler = async (event) => {
      const { dispatch } = this.props
      taxState = event.target.value

      // check the address is valid
      if (knownAddresses[taxState] === undefined) {
        return
      }

      dispatch(updateTaxState(taxState))

      // update the taxes for the cart
      const address = knownAddresses[taxState]
      await dispatch(
        updateTaxes(
          address.city,
          address.state,
          address.country,
          address.zip,
          cart.id,
          cartItems,
        ),
      )

      // refresh the cart state so that all line items are correct
      await dispatch(loadCart(cart.id))
      await dispatch(loadCartItems(cart.id))
    }

    return (
      <div className="row">
        <div className="col-md-4 order-md-2 mb-4">
          <span className="text-muted">Your cart</span>
          <Cart id="cart" items={cartItems} cart={cart} />
        </div>
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Billing address</h4>
          <Billing id="billing" taxState={taxState} updateAddressHandler={updateAddressHandler} knownAddresses={knownAddresses} />
        </div>
      </div>
    )
  }
}

CheckoutPage.propTypes = {
  taxState: PropTypes.string.isRequired,
  cart: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  cartId: PropTypes.string,
  cartItems: PropTypes.array, // eslint-disable-line react/forbid-prop-types
  dispatch: PropTypes.func.isRequired,
}

CheckoutPage.defaultProps = {
  cart: {},
  cartId: '',
  cartItems: [],
}

const mapStateToProps = state => ({
  cart: state.cart,
  cartId: state.cartId,
  cartItems: state.cartItems,
  taxState: state.taxState,
})

export default connect(mapStateToProps)(CheckoutPage)
