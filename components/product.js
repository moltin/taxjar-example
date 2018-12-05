import React, { Component } from 'react'

class Product extends Component {
  render() {
    const { id, name } = this.props

    return <div className="card">
      <div className="card-header">
        {name}
      </div>
      <div className="card-body">
        <pre>{JSON.stringify(this.props, null, 2)}</pre>
      </div>
    </div>
  }
}

export default Product
