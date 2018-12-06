import React, { Component } from 'react'
import Link from 'next/link'
import { connect } from 'react-redux'

import { loadProducts } from '../store'

class Navbar extends Component {
  state = {
    productsCount: 0,
  }

  componentDidMount() {
    this.props.dispatch(loadProducts())
  }

  render() {
    const { productsCount } = this.props

    return <div className="navbar navbar-expand-md navbar-dark bg-dark">
      <div className="container d-flex justify-content-between">
      <Link href="/">
        <a className="navbar-brand">
          Winter Wonderland
        </a>
      </Link>

      <div className="navbar-collapse collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link href="/products">
              <a className="nav-link">
                Products
                ({productsCount})
              </a>
            </Link>
          </li>
        </ul>

        <ul className="navbar-nav">
          <li className="nav-item">
            <Link href="/cart">
              <a className="nav-link">
                <span className="fas fa-shopping-cart mr-1"></span>
                <span>0 items</span>
              </a>
            </Link>
          </li>
        </ul>
        </div>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => ({ productsCount: state.products.length })
export default connect(mapStateToProps)(Navbar)
