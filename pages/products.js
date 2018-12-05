import React, { Component } from 'react'
import { connect } from 'react-redux'

import { loadProducts } from '../store'
import Product from '../components/product'

class ProductsPage extends Component {
  componentDidMount() {
    this.props.dispatch(loadProducts())
  }

  render() {
    const { products } = this.props

    return <div>
      <h1>i am have {products.length} products</h1>

      <div className="row">
        {products.map(product => <div className="col-3" key={product.id}>
          <Product {...product}/>
        </div>)}
      </div>
    </div>
  }
}


const mapStateToProps = (state) => ({ products: state.products })
export default connect(mapStateToProps)(ProductsPage)
