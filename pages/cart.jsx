import React, { Component } from 'react'
import { connect } from 'react-redux'

import CartItem from '../components/cart-item'
import { loadProducts } from '../store'

class CartPage extends Component {
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(loadProducts())
  }

  render() {
    const { cartItems } = this.props
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
            </tr>
          </thead>
          <tbody>
            {cartItems.map(item => <CartItem key={item.id} {...item} />)}
          </tbody>
        </table>
      </div>
    )
  }
}

const mapStateToProps = state => ({ cartItems: state.cartItems })
export default connect(mapStateToProps)(CartPage)
