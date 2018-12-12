import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Billing extends Component {
  render() {
    const {
      taxState,
      knownAddresses,
      updateAddressHandler,
      selectIsDisabled,
    } = this.props

    const optionItems = () => {
      const items = []
      Object.keys(knownAddresses).map((k) => {
        items.push(
          <option key={k} value={knownAddresses[k].state}>
            {knownAddresses[k].stateLong}
          </option>,
        )
        return ''
      })
      return items
    }

    return (
      <form>
        <div className="mt-4 alert alert-primary" role="alert">
          TaxJar will verify the full address.
          For convenience, we have some addresses that you can simply select
          rather than adding them via the inputs.
          <hr />
          <select
            value={taxState}
            className="custom-select d-block w-100"
            onChange={updateAddressHandler}
            id="address"
            disabled={selectIsDisabled}
          >
            <option key="default" value="" disabled={taxState !== undefined}>Choose an address...</option>
            {optionItems()}
          </select>
        </div>
      </form>
    )
  }
}

Billing.propTypes = {
  isBillingSelectDisabled: PropTypes.bool.isRequired,
  taxState: PropTypes.string.isRequired,
  knownAddresses: PropTypes.object.isRequired, // eslint-disable-line react/forbid-prop-types
  updateAddressHandler: PropTypes.func.isRequired,
}

const mapStateToProps = state => ({
  isBillingSelectDisabled: state.isBillingSelectDisabled,
  taxState: state.taxState,
  cartItems: state.cartItems,
  cart: state.cart,
})

export default connect(mapStateToProps)(Billing)
