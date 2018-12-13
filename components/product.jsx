import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { addToCart } from '../store'

class Product extends Component {
  async addToCart() {
    const { dispatch, id, tax_code, cartId } = this.props // eslint-disable-line
    dispatch(addToCart(cartId, id, tax_code))
  }

  render() {
    const {
      id, description, meta, main_image: mainImage, name, sku, tax_code: taxCode,
    } = this.props

    return (
      <div key={id} className="card">
        <img className="card-img-top" src={mainImage.link.href} alt={name} />
        <div className="card-body">
          <h3 className="card-title">{name}</h3>
          <p className="card-text">{description}</p>
          <p className="text-muted">
SKU:
            {sku}
            <br />
Tax Code:
            {' '}
            {taxCode}
          </p>
        </div>
        <div className="card-footer">
          <div className="float-left align-middle">
            {meta.display_price.without_tax.formatted}
            {' '}
            <small className="text-muted">(+ tax)</small>
          </div>
          <button type="button" onClick={() => this.addToCart()} className="float-right btn btn-primary">
            Buy Now
          </button>
        </div>
      </div>
    )
  }
}

Product.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  sku: PropTypes.string.isRequired,
  tax_code: PropTypes.string.isRequired,
  main_image: PropTypes.shape({ href: '' }),
  description: PropTypes.string,
  meta: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  dispatch: PropTypes.func.isRequired,
}

Product.defaultProps = {
  description: {},
  main_image: { href: '' },
  meta: {},
}

const mapStateToProps = state => ({ cartItems: state.cartItems, cartId: state.cartId })
export default connect(mapStateToProps)(Product)
