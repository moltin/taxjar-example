import React, { Component } from 'react'

class CartItem extends Component {

    render() {
        const { id, name, description, image, meta, quantity } = this.props.item

        return <tr key={id}>
            <td><img className="img-fluid rounded" src={image.href} alt={name} /></td>
            <td>{name}<br />{description}</td>
            <td>{quantity}</td>
            <td>{meta.display_price.without_tax.value.formatted} <small>(+ tax)</small></td>
        </tr>
    }
}

export default CartItem
