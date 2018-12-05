import React, { Component } from 'react'
import Link from 'next/link'

class Navbar extends Component {
  render() {
    return <div className="navbar navbar-expand-md navbar-dark bg-dark">
      <Link href="/">
        <a className="navbar-brand">
          Waters Winter Wonderland
        </a>
      </Link>

      <div className="navbar-collapse collapse">
        <ul className="navbar-nav mr-auto">
          <li className="nav-item">
            <Link href="/products">
              <a className="nav-link">
                Products
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
  }
}

export default Navbar
