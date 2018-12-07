import React, { Component } from 'react'
import { connect } from 'react-redux'

import Product from '../components/product'
import { loadProducts } from '../store'

class ProductsPage extends Component {

  componentDidMount() {
    this.props.dispatch(loadProducts())
  }
  
  render() {
    const { products } = this.props

    return <div className="card-deck">
      {products.map(product => <Product key={product.id} {...product}/>)}
    </div>
  }
}

const mapStateToProps = (state) => ({ products: state.products })
export default connect(mapStateToProps)(ProductsPage)
