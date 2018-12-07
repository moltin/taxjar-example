# Moltin < You > TaxJar

[Moltin](https://moltin.com) provide a [flexible commerce API](https://developers.moltin.com/) that allows you to add tax to items in your cart.

[TaxJar](https://www.taxjar.com) provide a [sales tax API](https://www.taxjar.com/api/) for developers to get calculations for products.

This respository demonstrates how you can leverage both services to build a simple, flexible commerce experience with accurate tax accounting quickly.


## Prerequisites

Before viewing these examples, you will need:

 - A Moltin account (a [30 day trial](https://dashboard.moltin.com/signup) is available).
 - A TaxJar account (a [30 day trial](https://app.taxjar.com/api_sign_up) is available).
 - Some products to demonstrate ([see below](#demonstration-scenario))`.


 ## Demonstration Scenario

In this demonstration, we will use selling in New York City as an example. According the the official [NYC website](https://www1.nyc.gov/nyc-resources/service/2389/sales-tax) then the following applies (in addition to others):

 > There is no sales tax on an item of clothing or footwear that costs less than $110. An item of clothing or footwear that costs $110 or more is subject to the full 8.875% tax rate. Sales tax is calculated per item, so even if you buy two or more items that add up to $110 or more, you only pay tax on the items that individually cost $110 or more.

### Tax Codes

TaxJars API has [an endpoint](https://developers.taxjar.com/api/reference/?javascript#categories) that describes different tax categories. As tax can different based on the _type_ of product you are selling, the categories from that endpoint need to be married with the product stored in Moltin.

To do this, we will create [custom data](https://docs.moltin.com/advanced/custom-data) for our products which allows us to add additional fields to our products and store the TaxJar Category code so that when adding products to Moltin, you can be explicit about the tax that should be applied.

### Nexus

TaxJars API has [and enpoint](https://developers.taxjar.com/api/reference/?javascript#nexus) that returns nexus information. `Nexus` is a legal term for a geographical region that you sell products in. For this example, we will be selling clothing to New York so the Nexus will be New York (as represented below from TaxJar).

```json
{
  "regions": [
    ...
    {
      "country_code": "US",
      "country": "United States",
      "region_code": "NY",
      "region": "New York"
    },
    ...
  ]
}}
```

### Setup

So, we need two products - one that costs < $100 and one that costs >= $100. Both of them should have the same tax code - `20010` ("Clothing"). You can add these products to your Moltin store via the [dashboard](https://dashboard.moltin.com/) or via the API.

### Using the API to create your custom flow and products

1. Get an access token:

```bash
curl -X "POST" "https://api.moltin.com/oauth/access_token" \
     -d "client_id=XXXX" \
     -d "client_secret=XXXX" \
     -d "grant_type=client_credentials"
```

2. Create a product data flow:

```bash
curl -X POST "https://api.moltin.com/v2/flows" \
     -H "Authorization: XXXX" \
     -H "Content-Type: application/json" \
     -d $'{
        "data": {
            "type": "flow",
            "name": "Products",
            "slug": "products",
            "description": "Extends the default product object",
            "enabled": true
        }
     }'
```

3. Add the `tax_code` field (substitute the FLOW_ID from the response in the previous call):

```bash
curl -X "POST" "https://api.moltin.com/v2/fields" \
     -H "Authorization: XXXX" \
     -H "Content-Type: application/json" \
     -d $'{
      "data": {
        "type": "field",
        "name": "Tax Code",
        "slug": "tax_code",
        "field_type": "string",
        "validation_rules": [
            {
                "type": "enum",
                "options": [
                    "10040",
                    "19000",
                    "19001",
                    "19002",
                    "19003",
                    "19004",
                    "19005",
                    "19006",
                    "19007",
                    "19008",
                    "19009",
                    "20010",
                    "20041",
                    "30070",
                    "31000",
                    "40010",
                    "40020",
                    "40030",
                    "40050",
                    "40060",
                    "41000",
                    "51010",
                    "81100",
                    "81110",
                    "81120",
                    "81300",
                    "81310",
                    "99999"
                ]
            }
        ],
        "description": "The tax code for this product as a TaxJar category",
        "required": true,
        "unique": false,
        "default": "",
        "enabled": true,
        "order": 1,
        "omit_null": false,
        "relationships": {
            "flow": {
                "data": {
                    "type": "flow",
                    "id": "{FLOW_ID}"
                }
            }
        }
      }
    }'
```

4. Create your first product (with a price of $109.99):

```bash
curl -X POST https://api.moltin.com/v2/products \
     -H "Authorization: Bearer XXXX" \
     -H "Content-Type: application/json" \
     -d $'{
        "data": {
            "type": "product",
            "name": "Christmas Hat",
            "slug": "christmas-hat",
            "sku": "hats.christmas",
            "description": "A glorious (and !cheap!) Christmas Hat",
            "manage_stock": false,
            "price": [
            {
                "amount": 10999,
                "currency": "USD",
                "includes_tax": false
            }
            ],
            "status": "live",
            "commodity_type": "physical",
            "tax_code": "20010"
        }
    }'
```

5. Create your second product (with a price of $110.00):

```bash
curl -X POST https://api.moltin.com/v2/products \
     -H "Authorization: Bearer XXXX" \
     -H "Content-Type: application/json" \
     -d $'{
        "data": {
            "type": "product",
            "name": "Christmas Sweater",
            "slug": "christmas-sweater",
            "sku": "sweaters.christmas",
            "description": "A glorious (and expensive) Christmas Sweater",
            "manage_stock": false,
            "price": [
            {
                "amount": 111,
                "currency": "USD",
                "includes_tax": false
            }
            ],
            "status": "live",
            "commodity_type": "physical",
            "tax_code": "20010"
        }
    }'
```

## Running the demo site

The demonstration site is a basic webpage built using React and bootstrap. To run it locally, clone this repo and run:

```bash
npm install && npm run-script dev
```

This will start the server locally on [localhost:3000](http://localhost:3000/).
