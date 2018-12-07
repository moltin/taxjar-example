import React, { Component } from 'react'
import { connect } from 'react-redux'

import Product from '../components/product'

class ProductsPage extends Component {
  render() {
    const { products } = this.props

    return (
      <div className="card-deck">
        {products.map(product => <Product key={product.id} {...product} />)}
      </div>
    )
  }
}

const mapStateToProps = state => ({ products: state.products })
export default connect(mapStateToProps)(ProductsPage)
