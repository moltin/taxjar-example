const express = require('express')
const { createClient } = require('@moltin/request')
const taxclient = require('../lib/taxjar')
require('dotenv').config()

const client = new createClient({ // eslint-disable-line new-cap
  client_id: process.env.MOLTIN_CLIENT_ID,
  client_secret: process.env.MOLTIN_CLIENT_SECRET,
})

const router = express.Router()

const fromCountry = process.env.FROM_COUNTRY
const fromZip = process.env.FROM_ZIP
const fromState = process.env.FROM_STATE
const fromCity = process.env.FROM_CITY
const fromStreet = process.env.FROM_STREET

const deleteTax = async (cartId, itemId, taxId) => { // eslint-disable-line arrow-body-style
  return client.delete(`carts/${cartId}/items/${itemId}/taxes/${taxId}`)
}

const createTax = async (cartId, itemId, taxObject) => { // eslint-disable-line arrow-body-style
  return client.post(`carts/${cartId}/items/${itemId}/taxes`, taxObject)
}

const getExistingTaxes = async (cartId) => {
  const taxes = []
  const { data } = await client.get(`carts/${cartId}/items`)
  data.forEach((item) => {
    try {
      item.relationships.taxes.data.forEach((taxRel) => {
        taxes.push({
          itemId: item.id,
          id: taxRel.id,
        })
      })
    } catch (e) {
      console.log('No tax on item', item.id)
    }
  })
  return taxes
}

const buildTaxJarRequest = (address, items) => {
  const request = {
    from_country: fromCountry,
    from_zip: fromZip,
    from_state: fromState,
    from_city: fromCity,
    from_street: fromStreet,

    to_city: address.city,
    to_state: address.jurisdiction,
    to_country: address.country,
    to_zip: address.zip,

    shipping: 0,
    line_items: [],
  }

  // note that we have hard coded our currency exponent against base 10 here
  // unit_price in TaxJar is different to Moltin's unit (pennies vs pounds)
  items.forEach((cartItem) => {
    const taxItem = {
      id: cartItem.id,
      quantity: cartItem.quantity,
      unit_price: cartItem.unit_price.amount / 100,
      product_tax_code: cartItem.tax_code,
    }
    request.line_items.push(taxItem)
  })

  return request
}

// Delete all of our existing taxes in this cart
router.delete('/tax', async (req, res) => {
  const { cartId } = req.body
  const existingTaxes = await getExistingTaxes(cartId)

  for (let i = 0; i < existingTaxes.length; i += 1) {
    const tax = existingTaxes[i]
    await deleteTax(cartId, tax.itemId, tax.id) // eslint-disable-line no-await-in-loop
    console.log('Deleted tax', tax.id)
  }

  res.status(200).send({})
})

// Get our tax jar calculations
router.post('/calculate', async (req, res) => {
  const taxJarRequest = buildTaxJarRequest(
    {
      city: req.body.city,
      jurisdiction: req.body.jurisdiction,
      zip: req.body.zip,
      country: req.body.country,
    },
    req.body.cartItems,
  )

  const taxJarResponse = await taxclient.taxForOrder(taxJarRequest)
  res.status(200).send(taxJarResponse)
})

// Apply tax to our cart based off TaxJar response
router.post('/tax', async (req, res) => {
  const { taxJarResponse, cartItems, cartId } = req.body

  try {
    const taxItems = taxJarResponse.data.tax.breakdown.line_items

    for (let i = 0; i < taxItems.length; i += 1) {
      const tax = taxItems[i]
      const cartItem = cartItems.filter(item => item.id === tax.id).shift()
      await createTax(cartId, tax.id, { // eslint-disable-line no-await-in-loop
        type: 'tax_item',
        name: 'Item Tax',
        jurisdiction: taxJarResponse.data.tax.jurisdictions.country,
        code: cartItem.tax_code,
        rate: taxJarResponse.data.tax.rate,
      })
    }
  } catch (e) {
    console.log('No tax to apply to this cart')
  }

  res.status(200).send({})
})

module.exports = router
