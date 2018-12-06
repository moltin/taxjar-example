import React, { Component } from 'react'
import { connect } from 'react-redux'

import Product from '../components/product'

class ProductsPage extends Component {
  render() {
    const { products } = this.props

    return <div>
      <div className="card-deck">
        {products.map(product => <Product {...product}/>)}
      </div>
    </div>
  }
}


const mapStateToProps = (state) => ({ products: state.products })
export default connect(mapStateToProps)(ProductsPage)
