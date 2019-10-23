# Moltin < You > TaxJar

[Moltin](https://moltin.com) provides a [flexible commerce API](https://developers.moltin.com/) that allows you to add tax to items in your cart.

[TaxJar](https://www.taxjar.com) provides a [sales tax API](https://www.taxjar.com/api/) for developers to get calculations for products.

This repository demonstrates how you can leverage both services to build a simple, flexible commerce experience with accurate tax accounting quickly.


## Prerequisites

Before viewing these examples, you will need:

 - A Moltin account (a [trial](https://www.moltin.com/trial-request) is available upon request).
 - A TaxJar account (a [30 day trial](https://app.taxjar.com/api_sign_up) is available).
 - Some products to demonstrate ([see below](#demonstration-scenario))`.


 ## Demonstration Scenario

In this example project we will demonstrate how to calculate sales tax via TaxJar and integrate it with your Moltin cart.

We will use clothing as an example because the tax rules differ based on the state, city and item (pretax) cost so allows us to check different scenarios.

For example, if you are selling in New York City then the [following applies](https://www1.nyc.gov/nyc-resources/service/2389/sales-tax) (in addition to others):

 > There is no sales tax on an item of clothing or footwear that costs less than $110. An item of clothing or footwear that costs more than $110 is subject to the full 8.875% tax rate. Sales tax is calculated per item, so even if you buy two or more items that are worthmore than $110 in total, you only pay tax on the items that individually cost more than $110.

In this example we will creaste three products - one that costs exactly $110.00, one that costs $110.01 and one that costs $200 to see how taxes change.

### Tax Codes

TaxJars API has [an endpoint](https://developers.taxjar.com/api/reference/?javascript#categories) that describes different tax categories. As tax can differ based on the _type_ of product you are selling, the categories from that endpoint need to be married with the product stored in Moltin.

To do this, we will create [custom data](https://docs.moltin.com/advanced/custom-data) for our products which allows us to add additional fields to our products and store the TaxJar Category code so that when adding products to Moltin, you can be explicit about the tax that should be applied.

### Nexus

TaxJars API has [an enpoint](https://developers.taxjar.com/api/reference/?javascript#nexus) that returns nexus information. `Nexus` is a legal term for a geographical region that you sell products in. For this example, we will be selling clothing to New York so the nexus will be New York (as represented below from TaxJar).

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

In this app, we will change the nexus used to calculate taxes so that it matches the state you're selling to. A primitive example would be if you had a warehouse in each of those states which then qualify as a nexus.

In your app, you may only have a single nexus and the tax you collect outside of the state will differ greatly than when you are collecting in the same state you have a nexus.

### Setup

So, we need three products - one that costs $110.00, one that costs $110.11 and one that costs $200. They should have the same tax code - `20010` ("Clothing"). You can add these products to your Moltin store via the [dashboard](https://dashboard.moltin.com/) or via the API.

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

3. Add the `tax_code` field (substitute the PRODUCT_FLOW_ID from the response in the previous call):

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
                    "id": "{PRODUCT_FLOW_ID}"
                }
            }
        }
      }
    }'
```

4. Create a cart item data flow:

```bash
curl -X POST "https://api.moltin.com/v2/flows" \
     -H "Authorization: XXXX" \
     -H "Content-Type: application/json" \
     -d $'{
        "data": {
            "type": "flow",
            "name": "Cart Items",
            "slug": "cart_items",
            "description": "Extends the default cart item object",
            "enabled": true
        }
     }'
```


5. Add the `tax_code` field (substitute the CART_FLOW_ID from the response in the previous call):

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
        "description": "The tax code for this cart item as a TaxJar category",
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
                    "id": "{CART_FLOW_ID}"
                }
            }
        }
      }
    }'
```

6. Create your first product (with a price of **$110.00**):

```bash
curl -X POST https://api.moltin.com/v2/products \
     -H "Authorization: Bearer XXXX" \
     -H "Content-Type: application/json" \
     -d $'{
        "data": {
            "type": "product",
            "name": "Hat",
            "slug": "hat",
            "sku": "hats.1",
            "description": "A hat",
            "manage_stock": false,
            "price": [
            {
                "amount": 11000,
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

7. Create your second product (with a price of **$110.01**):

```bash
curl -X POST https://api.moltin.com/v2/products \
     -H "Authorization: Bearer XXXX" \
     -H "Content-Type: application/json" \
     -d $'{
        "data": {
            "type": "product",
            "name": "Sweater",
            "slug": "sweater",
            "sku": "sweaters.1",
            "description": "A sweater",
            "manage_stock": false,
            "price": [
            {
                "amount": 11001,
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

8. Create your third product (with a price of **$200.00**):

```bash
curl -X POST https://api.moltin.com/v2/products \
     -H "Authorization: Bearer XXXX" \
     -H "Content-Type: application/json" \
     -d $'{
        "data": {
            "type": "product",
            "name": "Socks",
            "slug": "socks",
            "sku": "socks.1",
            "description": "A pair of socks",
            "manage_stock": false,
            "price": [
            {
                "amount": 20000,
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

9. (optionally) add some images to the products via the [dashboard](https://dashboard.moltin.com/) or the API.

## Running the demo site

The demonstration site is a basic webpage built using React and bootstrap. To run it locally, clone this repo and run:

```bash
yarn install
yarn dev
```

This will start the server locally on [localhost:3000](http://localhost:3000/) and you can see server side operations in your terminal window.
