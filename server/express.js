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
    amount: 15,
    shipping: 1.5,
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
      {
        id: '1',
        quantity: 1,
        product_tax_code: '20010',
        unit_price: 15,
        discount: 0,
      },
    ],
  }
  console.log(JSON.stringify(req.body))
  req.body.forEach((element) => {
    // TODO: Build line item per cart entry
    console.log(element)
  })
  taxclient.taxForOrder(taxRequest).then(response => res.status(200).json({ response }))
})

module.exports = router
