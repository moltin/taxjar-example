import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class Billing extends Component {
  render() {
    const {
      isBillingSelectDisabled,
      taxState,
      knownAddresses,
      updateAddressHandler,
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
          <p>
            In a real store, you would be asking the customer for their
            billing and shipping information here.
          </p>
          <p>
            For convenience, we have some default addresses that you can simply select
            which prepopoulates the TaxJar API call with a valid address.
          </p>
          <p>
            It is important to note that the address you select
            also changes the nexus address.
            This is because collecting state tax online
            is dependent on origin and/or destination so to simplify this example
            we calculate the tax based on the user being sent their items from a warehouse
            within the same state.
          </p>
          <hr />
          <select
            value={taxState}
            className="custom-select d-block w-100"
            onChange={updateAddressHandler}
            disabled={isBillingSelectDisabled}
            id="address"
          >
            <option key="default" value="" disabled={taxState !== null}>Choose an address...</option>
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
