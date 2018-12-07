import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'

import { client } from './lib/moltin'

const initialState = {
  cartId: 'abc', // todo make this unique
  products: [],
  cartItems: {},
}

export const actionTypes = {
  LOAD_PRODUCTS: 'LOAD_PRODUCTS',
  SET_PRODUCTS: 'SET_PRODUCTS',
  SET_CART_ITEMS: 'SET_CART_ITEMS',
}

export const reducer = (state = initialState, action) => {
  // console.log('reducer()', action)
  switch(action.type) {
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
    default:
      return state
  }
}

export const loadProducts = () => async (dispatch) => {
  const products = await client.get('products?include=main_images')

  products.data.map(product => {
    products.included.main_images.map(image => {
      if (image.id == product.relationships.main_image.data.id) {
        product.main_image = image
      }
    })
  })

  dispatch(setProducts(products.data))
}

export const setProducts = (products) => {
  return { type: actionTypes.SET_PRODUCTS, products }
}

export const setCartItems = (items) => {
  return { type: actionTypes.SET_CART_ITEMS, items }
}

export function initializeStore(initialState = initialState) {
  return createStore(reducer, initialState, applyMiddleware(thunkMiddleware))
}
