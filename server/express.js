const express = require('express')
const { createClient } = require('@moltin/request')
const taxclient = require('../lib/taxjar')
require('dotenv').config()

const client = new createClient({
  client_id: process.env.MOLTIN_CLIENT_ID,
  client_secret: process.env.MOLTIN_CLIENT_SECRET,
})

const router = express.Router()


router.post('/tax', async (req, res) => {
  // TODO: Need to change this based on customer address
  const resObject = { data: [] }
  const taxJarRequest = {
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

  req.body.cart_items.forEach((cartItem) => {
    const taxItem = {}
    taxItem.id = cartItem.id
    taxItem.quantity = cartItem.quantity
    taxItem.unit_price = cartItem.unit_price.amount
    taxJarRequest.line_items.push(taxItem)
  })
  const taxJarResponse = await taxclient.taxForOrder(taxJarRequest)

  // TODO: Create a moltin tax item based on response from tax jar
  const taxItems = taxJarResponse.tax.breakdown.line_items
  taxItems.forEach(async (taxItem) => {
    const moltinTaxItem = {
      type: 'tax_item',
      name: 'VAT',
      jurisdiction: taxJarResponse.tax.jurisdictions.country,
      code: 'SOMETAXCODE',
      rate: taxJarResponse.tax.rate,
    }

    // TODO: Work out if tax already applied.
    // If tax already is applied do we want to delete and reapply?
    // let currentTaxes = await client.get(`carts/${req.body.cart_id}/items/${taxItem.id}/taxes`)
    // Add tax item
    console.log(moltinTaxItem)
    console.log(`carts/${req.body.cart_id}/items/${taxItem.id}/taxes`)
    const taxItemResponse = await client.post(`carts/${req.body.cart_id}/items/${taxItem.id}/taxes`, moltinTaxItem)
    console.log(taxItemResponse)
    resObject.data.push(taxItemResponse)
  })
})

module.exports = router
