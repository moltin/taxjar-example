import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

import { loadCart } from '../store'

class Navbar extends Component {
  componentDidMount() {
    const { cartId } = this.props
    this.props.dispatch(loadCart(cartId))
  }

  render() {
    const { cartItems } = this.props
    let cartItemLength = 0
    cartItems.forEach((item) => {
      cartItemLength += item.quantity
    })

    return (
      <div className="navbar navbar-expand-md navbar-dark bg-dark">
        <div className="container d-flex justify-content-between">
          <Link href="/">
            <a className="navbar-brand">
          Winter Wonderland
            </a>
          </Link>

          <div className="navbar-collapse collapse">
            <ul className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link href="/cart">
                  <a className="nav-link">
                    <span className="fas fa-shopping-cart mr-1" />
                    <span>
                      {cartItemLength}
                      {' '}
items
                    </span>
                  </a>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({ cartItems: state.cartItems, cartId: state.cartId })
export default connect(mapStateToProps)(Navbar)
