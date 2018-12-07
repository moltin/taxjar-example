import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setCartItems } from '../store'
import { client } from '../lib/moltin'

class Product extends Component {

  constructor(props) {
    super(props)
    this.addToCart = this.addToCart.bind(this);
  }

  async addToCart() {

    let items = await client.post(`carts/abc/items`, { // todo `abc` needs to come from redux
      id: this.props.id,
      type: 'cart_item',
      quantity: 1
    })

    this.props.dispatch(setCartItems(items.data))
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
        <button onClick={this.addToCart} className="float-right btn btn-primary">
          Buy Now
        </button>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => ({ cartItems: state.cartItems })
export default connect(mapStateToProps)(Product)
