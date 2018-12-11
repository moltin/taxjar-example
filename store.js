import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import axios from 'axios'
import { client, generateUUID } from './lib/moltin'

const initialState = {
  cartId: null,
  products: [],
  cartItems: [],
  cart: {},
}

export const actionTypes = {
  LOAD_PRODUCTS: 'LOAD_PRODUCTS',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CART_ITEMS: 'SET_CART_ITEMS',
  SET_CART: 'SET_CART',
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
    default:
      return state
  }
}

// Quick helpers to set some state
export const setProducts = products => ({ type: actionTypes.SET_PRODUCTS, products })
export const setCart = cart => ({ type: actionTypes.SET_CART, cart })
export const setCartItems = items => ({ type: actionTypes.SET_CART_ITEMS, items })

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

export const addToCart = (cartId, productId) => async (dispatch) => {
  const { data } = await client.post(`carts/${cartId}/items`, {
    id: productId,
    type: 'cart_item',
    quantity: 1,
  })

  dispatch(setCartItems(data))
  loadCart(cartId)
}

export const removeFromCart = (cartId, itemId) => async (dispatch) => {
  const { data } = await client.delete(`carts/${cartId}/items/${itemId}`)
  dispatch(setCartItems(data))
  loadCart(cartId)
}

export const assignTax = (cartItems, cartId) => async (dispatch) => {
  console.log(cartItems)
  let response = await axios.post('/api/tax', {
    cart_id: cartId,
    cart_items: cartItems
  })
  console.log(response)

  // TODO: Assign cart item tax to prop / state

  // dispatch(setCartItems(data))
}

export const loadCartItems = cartId => async (dispatch) => {
  const { data } = await client.get(`carts/${cartId}/items`)
  dispatch(setCartItems(data))
  loadCart(cartId)
}

export function initializeStore(state = initialState) {
  const cartId = state.cartId || generateUUID()
  const initialStoreState = {
    ...state,
    cartId,
  }
  return createStore(reducer, initialStoreState, applyMiddleware(thunkMiddleware))
}
