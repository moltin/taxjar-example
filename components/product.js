import React, { Component } from 'react'
import { connect } from 'react-redux'
import { addToCart } from '../store'

class Product extends Component {

  async addToCart() {
    const { id, cartId } = this.props
    this.props.dispatch(addToCart(cartId, id))
  }

  render() {
    const { id, description, meta, main_image, name, sku, tax_code } = this.props

    return <div key={id} className="card">
      <img className="card-img-top" src={main_image.link.href} alt={name} />
      <div className="card-body">
        <h3 className="card-title">{name}</h3>
        <p className="card-text">{description}</p>
        <p className="text-muted">SKU: {sku}<br />Tax Code: {tax_code}</p>
      </div>
      <div className="card-footer">
        <div className="float-left align-middle">
          {meta.display_price.without_tax.formatted}
          <small className="text-muted">(+ tax)</small>
        </div>
        <button onClick={() => this.addToCart()} className="float-right btn btn-primary">
          Buy Now
        </button>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => ({ cartItems: state.cartItems, cartId: state.cartId })
export default connect(mapStateToProps)(Product)
