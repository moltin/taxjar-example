const express = require('express')
const taxclient = require('../lib/taxjar')

const router = express.Router()


router.post('/tax', (req, res) => {
  const taxRequest = {
    from_country: 'US',
    from_zip: '92093',
    from_state: 'CA',
    from_city: 'La Jolla',
    from_street: '9500 Gilman Drive',
    to_country: 'US',
    to_zip: '90002',
    to_state: 'CA',
    to_city: 'Los Angeles',
    to_street: '1335 E 103rd St',
    shipping: 0,
    nexus_addresses: [
      {
        id: 'Main Location',
        country: 'US',
        zip: '92093',
        state: 'CA',
        city: 'La Jolla',
        street: '9500 Gilman Drive',
      },
    ],
    line_items: [
    ],
  }

  req.body.forEach((cartItem) => {
    // TODO: Build line item per cart entry
    const taxItem = {}
    taxItem.id = cartItem.id
    taxItem.quantity = cartItem.quantity
    taxItem.unit_price = cartItem.unit_price.amount
    taxRequest.line_items.push(taxItem)
  })
  const taxJarResponse = taxclient.taxForOrder(taxRequest).then(response => response)

  // TODO: Create a moltin tax item based on response from tax jar
  // let taxItems = response.data.response.tax.breakdown.line_items
  // taxItems.forEach(taxItem => {
  //   let moltinTaxItem = {
  //     data: {
  //       type: "tax_item",
  //       name: "VAT",
  //       jurisdiction: "UK",
  //       code: "SOMETAXCODE",
  //       rate: 0.2
  //     }
  //   }
  //   client.post(`carts/${cartId}/items/${taxItem.id}/taxes`, moltinTaxItem)
  // });
})

module.exports = router
