import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

class CartItemSmall extends Component {
  render() {
    const {
      id, name, description, meta, quantity,
    } = this.props

    return (
      <li key={id} className="list-group-item d-flex justify-content-between lh-condensed">
        <div>
          <h6 className="my-0">
            {quantity}
            &nbsp;x&nbsp;
            {name}
          </h6>
          <small className="text-muted">{description}</small>
        </div>
        <span className="text-muted">{meta.display_price.without_tax.value.formatted}</span>
      </li>
    )
  }
}

CartItemSmall.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  quantity: PropTypes.number.isRequired,
  description: PropTypes.string,
  meta: PropTypes.object, // eslint-disable-line react/forbid-prop-types
}

CartItemSmall.defaultProps = {
  description: '',
  meta: {},
}

const mapStateToProps = state => ({ cartId: state.cartId })
export default connect(mapStateToProps)(CartItemSmall)
