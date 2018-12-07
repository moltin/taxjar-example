import React, { Component } from 'react'
import PropTypes from 'prop-types'

class CartItem extends Component {
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
          {description}
        </td>
        <td>{quantity}</td>
        <td>
          {meta.display_price.without_tax.value.formatted}
          {' '}
          <small>(+ tax)</small>
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
}

CartItem.defaultProps = {
  description: '',
  image: { href: '' },
  meta: {},
}

export default CartItem
