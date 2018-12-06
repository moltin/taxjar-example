import React, { Component } from 'react'

class Product extends Component {
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
        <button className="btn btn-primary">
          Buy now for {meta.display_price.without_tax.formatted}
        </button>
      </div>
    </div>
  }
}

export default Product
