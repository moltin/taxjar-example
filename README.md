# Moltin < You > TaxJar

[Moltin](https://moltin.com) provide a [flexible commerce API](https://developers.moltin.com/) that allows you to add tax to items in your cart.

[TaxJar](https://www.taxjar.com) provide a [sales tax API](https://www.taxjar.com/api/) for developers to get calculations for products.

This respository demonstrates how you can leverage both services to build a simple, flexible commerce experience with accurate tax accounting quickly.


## Prerequisites

Before viewing these examples, you will need:

 - A Moltin account (a [30 day trial](https://dashboard.moltin.com/signup) is available).
 - A TaxJar account (a [30 day trial](https://app.taxjar.com/api_sign_up) is available).
 - Some products to demonstrate (see below).


 ## Demonstration Scenario

In this demonstration, we will use selling in New York City as an example. According the the official [NYC website](https://www1.nyc.gov/nyc-resources/service/2389/sales-tax) then the following applies (in addition to others):

 > There is no sales tax on an item of clothing or footwear that costs less than $110. An item of clothing or footwear that costs $110 or more is subject to the full 8.875% tax rate. Sales tax is calculated per item, so even if you buy two or more items that add up to $110 or more, you only pay tax on the items that individually cost $110 or more.

So, first of all we need two products - one that costs < $100 and one that costs >= $100. You can add these products to your Moltin store via the [dashboard](https://dashboard.moltin.com/) or via the API.

### Using the API to create your products

1. Get an access token:

```bash
curl -X "POST" "https://api.moltin.com/oauth/access_token" \
     -d "client_id=XXXX" \
     -d "client_secret=XXXX" \
     -d "grant_type=client_credentials"
```

2. Create your first product (with a price of $109.99):

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
            "commodity_type": "physical"
        }
    }'
```

3. Create your second product (with a price of $110.00):

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
            "commodity_type": "physical"
        }
    }'
```
