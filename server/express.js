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

router.post('/tax', async (req, res) => {
  const calls = []
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  console.log('tax req received')
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

  console.log('taxJarRequest body:', JSON.stringify(taxJarRequest))

  calls.push({ taxJarGetTaxForOrder: taxJarRequest })
  const taxJarResponse = await taxclient.taxForOrder(taxJarRequest).catch((err) => {
    // console.log(err)
    res.status(err.status).send({
      errors: [
        {
          message: err.detail,
        },
      ],
    })
  })
  calls.push({ taxJarResponseGetTaxForOrder: taxJarResponse })
  console.log('taxJarResponse body:', JSON.stringify(taxJarResponse))

  const existingTaxes = await client.get(`carts/${req.body.cartId}/items`)
  calls.push({ getExistingTaxes: `carts/${req.body.cartId}/items` })
  const l = async () => (existingTaxes.data.forEach(async (cartItem) => {
    sleep(1000).then(() => {
      if (
        typeof cartItem.relationships !== 'undefined'
        && typeof cartItem.relationships.taxes !== 'undefined'
        && typeof cartItem.relationships.taxes.data !== 'undefined'
      ) {
        cartItem.relationships.taxes.data.forEach(async (taxRel) => {


          calls.push({ deletingExistingTaxItem: `carts/${req.body.cartId}/items/${cartItem.id}/taxes/${taxRel.id}` })
          console.log('Deleting tax item:', `carts/${req.body.cartId}/items/${cartItem.id}/taxes/${taxRel.id}`)
          const { statusCode } = await client.delete(`carts/${req.body.cartId}/items/${cartItem.id}/taxes/${taxRel.id}`).catch(console.error)
          calls.push({ deletedExistingTaxItem: statusCode })
          console.log('Deleted existing moltin tax item:', statusCode)
        })
      }
    })
  })
  )
  l()
  // if line_items is empty, it means there are no taxes applicable to the cart
  if (taxJarResponse.tax.breakdown !== undefined) {
    const taxItems = taxJarResponse.tax.breakdown.line_items
    taxItems.forEach(async (taxItem) => {
      const cartItem = req.body.cartItems.filter(item => item.id === taxItem.id)
      const moltinTaxItem = {
        type: 'tax_item',
        name: 'Item Tax',
        jurisdiction: taxJarResponse.tax.jurisdictions.country,
        code: cartItem[0].tax_code,
        rate: taxJarResponse.tax.rate,
      }

      console.log('Creating moltin tax for cart item:', taxItem.id, moltinTaxItem)
      calls.push({
        creatingTaxItem: {
          url: `carts/${req.body.cartId}/items/${taxItem.id}/taxes`,
          body: moltinTaxItem,
        },
      })
      const { statusCode } = await client.post(`carts/${req.body.cartId}/items/${taxItem.id}/taxes`, moltinTaxItem).catch(console.error)
      calls.push({ createdTaxItem: statusCode })
      // console.log('Created moltin tax item:', data)
      console.log('status:', statusCode)
    })
  } else {
    calls.push({
      taxJarNoBreakdown: true,
    })
    console.log('TaxJar responded without breakdown, no moltin taxt items created')
  }

  res.status(219).send(calls)
})

module.exports = router
