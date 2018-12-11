import React, { Component } from 'react'
import { connect } from 'react-redux'

class Billing extends Component {
  render() {
    return (
      <form className="needs-validation" noValidate="">
        <div className="mt-4 alert alert-primary" role="alert">
          For this example, all you need to update here is the billing state
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <input type="text" className="form-control" id="firstName" placeholder="First Name" required="" />
          </div>
          <div className="col-md-6 mb-3">
            <input type="text" className="form-control" id="lastName" placeholder="Last Name" required="" />
          </div>
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" id="address" placeholder="Address line 1" required="" />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" id="address2" placeholder="Address line 2 (Optional)" />
        </div>
        <div className="row">
          <div className="col-md-5 mb-3">
            <select className="custom-select d-block w-100" id="country" required="">
              <option value="US">United States</option>
            </select>
          </div>
          <div className="col-md-4 mb-3">
            <select className="custom-select d-block w-100" id="state" required="">
              <option value="">State...</option>
              <option value="CA">California</option>
              <option value="NY">New York</option>
              <option value="WA">Washington</option>
            </select>
          </div>
          <div className="col-md-3 mb-3">
            <input type="text" className="form-control" id="zip" placeholder="ZIP" required="" />
          </div>
        </div>
        <button className="btn btn-primary btn-lg btn-block" type="submit">Calculate Taxes</button>
      </form>
    )
  }
}

const mapStateToProps = state => ({
  cartItems: state.cartItems,
  cart: state.cart,
})

export default connect(mapStateToProps)(Billing)
