import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { removeFromCart } from '../store'

class CartItem extends Component {
  async removeItem() {
    const { dispatch, id, cartId } = this.props
    dispatch(removeFromCart(cartId, id))
  }

  render() {
    const {
      id, name, description, image, meta, quantity,
    } = this.props

    return (
      <tr key={id}>
        <td><img className="img-fluid rounded" src={image.href} alt={name} /></td>
        <td>
          {name}
          <br />
          <span className="text-muted">
            {description}
          </span>
        </td>
        <td>{quantity}</td>
        <td>
          {meta.display_price.without_tax.value.formatted}
          {' '}
          <small>(+ tax)</small>
        </td>
        <td>
          <button type="button" onClick={() => this.removeItem()} className="btn btn-danger btn-sm">
            <span className="fas fa-trash-alt mr-1" />
          </button>
        </td>
      </tr>
    )
  }
}

CartItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  description: PropTypes.string,
  image: PropTypes.shape({ href: PropTypes.string }),
  meta: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  dispatch: PropTypes.func.isRequired,
}

CartItem.defaultProps = {
  description: '',
  image: { href: '' },
  meta: {},
}

const mapStateToProps = state => ({ cartId: state.cartId })
export default connect(mapStateToProps)(CartItem)
