const express = require('express')
const { createClient } = require('@moltin/request')
const taxclient = require('../lib/taxjar')
require('dotenv').config()

const client = new createClient({
  client_id: process.env.MOLTIN_CLIENT_ID,
  client_secret: process.env.MOLTIN_CLIENT_SECRET,
})

const router = express.Router()

const fromCountry = process.env.FROM_COUNTRY
const fromZip = process.env.FROM_ZIP
const fromState = process.env.FROM_STATE
const fromCity = process.env.FROM_CITY
const fromStreet = process.env.FROM_STREET


// Get our tax jar calculations
router.post('/calculate', async (req, res) => {
  const taxJarRequest = {

    from_country: fromCountry,
    from_zip: fromZip,
    from_state: fromState,
    from_city: fromCity,
    from_street: fromStreet,

    to_city: req.body.city,
    to_state: req.body.jurisdiction,
    to_country: req.body.country,
    to_zip: req.body.zip,

    shipping: 0,
    line_items: [],
  }
  req.body.cartItems.forEach((cartItem) => {
    const taxItem = {
      id: cartItem.id,
      quantity: cartItem.quantity,
      unit_price: cartItem.unit_price.amount / 100, // note that we have hard coded our exponent against base 10 here
      product_tax_code: cartItem.tax_code,
    }
    taxJarRequest.line_items.push(taxItem)
  })

  const taxJarResponse = await taxclient.taxForOrder(taxJarRequest).catch((err) => {
    res.status(err.status).send({
      errors: [
        {
          message: err.detail,
        },
      ],
    })
  })

  res.status(200).send(taxJarResponse)
})

// Delete all of our taxes
router.delete('/tax', async (req, res) => {
  const { cartId } = req.body
  const existingTaxes = await client.get(`carts/${cartId}/items`).catch((err) => {
    res.status(400).send({
      errors: [
        {
          message: err.errors,
        },
      ],
    })
  })

  await existingTaxes.data.forEach(async (cartItem) => {
    if (
      typeof cartItem.relationships !== 'undefined'
        && typeof cartItem.relationships.taxes !== 'undefined'
        && typeof cartItem.relationships.taxes.data !== 'undefined'
    ) {
      await cartItem.relationships.taxes.data.forEach(async (taxRel) => {
        const response = await client.delete(`carts/${cartId}/items/${cartItem.id}/taxes/${taxRel.id}`).catch((err) => {
          res.status(400).send({
            errors: [
              {
                message: err.errors,
              },
            ],
          })
        })
        console.log(`Status? - ${response}`)
        console.log(`Tax delete: carts/${cartId}/items/${cartItem.id}/taxes/${taxRel.id}`)
      })
    }
  })
  res.status(200).send({})
})

// Apply tax to our cart based off tax jar response
router.post('/tax', async (req, res) => {
  const { taxJarResponse, cartItems } = req.body
  // if line_items is empty, it means there are no taxes applicable to the cart
  if (taxJarResponse.data.tax.breakdown !== undefined) {
    const taxItems = taxJarResponse.data.tax.breakdown.line_items
    await taxItems.forEach(async (taxItem) => {
      const cartItem = cartItems.filter(item => item.id === taxItem.id)
      const moltinTaxItem = {
        type: 'tax_item',
        name: 'Item Tax',
        jurisdiction: taxJarResponse.data.tax.jurisdictions.country,
        code: cartItem[0].tax_code,
        rate: taxJarResponse.data.tax.rate,
      }
      const { statusCode } = await client.post(`carts/${req.body.cartId}/items/${taxItem.id}/taxes`, moltinTaxItem).catch(console.error)
      // console.log('Created moltin tax item:', data)
      console.log('status for tax create:', statusCode)
    })
  } else {
    console.log('TaxJar responded without breakdown, no moltin taxt items created')
  }

  res.status(200).send({})
})

module.exports = router
