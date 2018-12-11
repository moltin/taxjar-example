const Taxjar = require('taxjar')
require('dotenv').config()

module.exports = new Taxjar({
  apiKey: process.env.TAX_JAR_KEY,
})
