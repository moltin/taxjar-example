import React, { Component } from 'react'

class Product extends Component {
  render() {
    const { id, description, meta, main_image, name, sku, tax_code } = this.props

    return <div key={id} className="card w-75">
      <img className="card-img-top" src={main_image.link.href} alt={name} />
      <div className="card-img-overlay">
        <h3 className="card-title text-light">{name}</h3>
      </div>
      <div className="card-body">
        <p className="card-text">{description}</p>
        <p className="text-muted">SKU: {sku}<br />Tax Code: {tax_code}</p>
      </div>
      <div className="card-footer">
        <a href="#" className="btn btn-success">
          Buy now for {meta.display_price.without_tax.formatted}
        </a>
      </div>
    </div>
  }
}

export default Product
