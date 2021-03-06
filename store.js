import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import axios from 'axios'
import { client, generateUUID } from './lib/moltin'

const initialState = {
  cartId: null,
  products: [],
  cartItems: [],
  cart: {},
  // `taxState` is simply the (geographic) state value so we can maintain taxe prices
  // when the user navigates different pages after selecting an address during checkout
  taxState: null,
  isBillingSelectDisabled: false,
}

export const actionTypes = {
  LOAD_PRODUCTS: 'LOAD_PRODUCTS',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CART_ITEMS: 'SET_CART_ITEMS',
  SET_CART: 'SET_CART',
  SET_TAX_STATE: 'SET_TAX_STATE',
  SET_IS_BILLING_SELECT_DISABLED: 'SET_IS_BILLING_SELECT_DISABLED',
}

export const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_PRODUCTS:
      return {
        ...state,
        products: action.products,
      }
    case actionTypes.SET_CART_ITEMS:
      return {
        ...state,
        cartItems: action.items,
      }
    case actionTypes.SET_CART:
      return {
        ...state,
        cart: action.cart,
      }
    case actionTypes.SET_TAX_STATE:
      return {
        ...state,
        taxState: action.taxState,
      }
    case actionTypes.SET_IS_BILLING_SELECT_DISABLED:
      return {
        ...state,
        isBillingSelectDisabled: action.isBillingSelectDisabled,
      }
    default:
      return state
  }
}

// Quick helpers to set some state
export const setProducts = products => ({ type: actionTypes.SET_PRODUCTS, products })
export const setCart = cart => ({ type: actionTypes.SET_CART, cart })
export const setCartItems = items => ({ type: actionTypes.SET_CART_ITEMS, items })
export const updateTaxState = taxState => ({ type: actionTypes.SET_TAX_STATE, taxState })
export const updateIsBillingSelectDisabled = disabled => ({
  type: actionTypes.SET_IS_BILLING_SELECT_DISABLED,
  disabled,
})

export const loadProducts = () => async (dispatch) => {
  const products = await client.get('products?include=main_images')

  const data = products.data.map((product) => {
    const mainImage = products.included.main_images.find(image => (
      image.id === product.relationships.main_image.data.id
    ))
    return {
      ...product,
      main_image: mainImage,
    }
  })

  dispatch(setProducts(data))
}


export const loadCart = cartId => async (dispatch) => {
  const { data } = await client.get(`carts/${cartId}`)
  dispatch(setCart(data))
}

export const addToCart = (cartId, productId, taxCode) => async (dispatch) => {
  const { data } = await client.post(`carts/${cartId}/items`, {
    id: productId,
    type: 'cart_item',
    quantity: 1,
    tax_code: taxCode,
  })
  dispatch(setCartItems(data))
  loadCart(cartId)
}

export const removeFromCart = (cartId, itemId) => async (dispatch) => {
  const { data } = await client.delete(`carts/${cartId}/items/${itemId}`)
  dispatch(setCartItems(data))
  loadCart(cartId)
}

export const loadCartItems = cartId => async (dispatch) => {
  const { data } = await client.get(`carts/${cartId}/items`)
  dispatch(setCartItems(data))
  loadCart(cartId)
}

export const updateTaxes = (
  city, jurisdiction, country, zip, nexusAddresses, cartId, cartItems,
) => async () => {
  // Calculate based on new jurisdiction
  const taxJarResponse = await axios.post('/api/calculate', {
    city,
    jurisdiction,
    country,
    zip,
    nexusAddresses,
    cartItems,
  }).catch((e) => {
    console.log('e', e)
  })

  // Delete existing taxes since we are updating
  await axios.delete('/api/tax', {
    data: { cartId },
  }).catch((e) => {
    console.log('e', e)
  })

  // Apply new taxes
  await axios.post('/api/tax', {
    cartId,
    cartItems,
    taxJarResponse,
  }).catch((e) => {
    console.log('e', e)
  })
}

export function initializeStore(state = initialState) {
  const cartId = state.cartId || generateUUID()
  const initialStoreState = {
    ...state,
    cartId,
  }
  return createStore(reducer, initialStoreState, applyMiddleware(thunkMiddleware))
}
