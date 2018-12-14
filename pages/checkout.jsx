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
  updateIsBillingSelectDisabled,
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
        nexus_addresses: [{
          country: 'US',
          state: 'CA',
          zip: '90001',
        }],
      },
      NY: {
        city: 'New York City',
        state: 'NY',
        stateLong: 'New York (NYC)',
        country: 'US',
        zip: '10001',
        nexus_addresses: [{
          country: 'US',
          state: 'NY',
          zip: '10541',
        }],
      },
      MA: {
        city: 'Boston',
        state: 'MA',
        stateLong: 'Massachusetts (Boston)',
        country: 'US',
        zip: '02108',
        nexus_addresses: [{
          country: 'US',
          state: 'MA',
          zip: '02180',
        }],
      },
    }
    const {
      cart, cartItems, isBillingSelectDisabled, taxState,
    } = this.props

    const updateAddressHandler = async (event) => {
      const { dispatch } = this.props
      const newTaxState = event.target.value

      // check the address is valid
      if (knownAddresses[taxState] === undefined) {
        return
      }

      dispatch(updateIsBillingSelectDisabled(true))

      dispatch(updateTaxState(newTaxState))

      // update the taxes for the cart
      const address = knownAddresses[newTaxState]
      await dispatch(
        updateTaxes(
          address.city,
          address.state,
          address.country,
          address.zip,
          address.nexus_addresses,
          cart.id,
          cartItems,
        ),
      )

      // refresh the cart state so that all line items are correct
      await dispatch(loadCart(cart.id))
      await dispatch(loadCartItems(cart.id))

      dispatch(updateIsBillingSelectDisabled(false))
    }

    return (
      <div className="row">
        <div className="col-md-4 order-md-2 mb-4">
          <span className="text-muted">Your cart</span>
          <Cart id="cart" items={cartItems} cart={cart} />
        </div>
        <div className="col-md-8 order-md-1">
          <h4 className="mb-3">Billing address</h4>
          <Billing id="billing" isBillingSelectDisabled={isBillingSelectDisabled} taxState={taxState} updateAddressHandler={updateAddressHandler} knownAddresses={knownAddresses} />
        </div>
      </div>
    )
  }
}

CheckoutPage.propTypes = {
  isBillingSelectDisabled: PropTypes.bool.isRequired,
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
  isBillingSelectDisabled: state.isBillingSelectDisabled,
  cart: state.cart,
  cartId: state.cartId,
  cartItems: state.cartItems,
  taxState: state.taxState,
})

export default connect(mapStateToProps)(CheckoutPage)
