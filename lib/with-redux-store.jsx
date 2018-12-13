import React from 'react'
import { initializeStore } from '../store'

const isServer = typeof window === 'undefined'
const NEXT_REDUX_STORE = '__NEXT_REDUX_STORE__'
const storeState = 'storeState'

/* global window */
function getOrCreateStore(initialState) {
  // Always make a new store if server, otherwise state is shared between requests
  if (isServer) {
    return initializeStore(initialState)
  }

  // Create store if unavailable on the client and set it on the window object
  if (!window[NEXT_REDUX_STORE]) {
    let localStorageState = JSON.parse(window.localStorage.getItem(storeState))
    window[NEXT_REDUX_STORE] = initializeStore( localStorageState ?  localStorageState : initialState)
  }

  // Keep localstorage up to date with changes
  window.localStorage.setItem(storeState, JSON.stringify(window[NEXT_REDUX_STORE].getState()))

  return window[NEXT_REDUX_STORE]
}

export default App => class AppWithRedux extends React.Component {
  static async getInitialProps(appContext) {
    // Get or Create the store with `undefined` as initialState
    // This allows you to set a custom default initialState
    const reduxStore = getOrCreateStore()

    let appProps = {}
    if (typeof App.getInitialProps === 'function') {
      appProps = await App.getInitialProps({
        ...appContext,
        ctx: {
          ...appContext.ctx,
          // Provide the store to getInitialProps of pages
          reduxStore,
        },
      })
    }

    return {
      ...appProps,
      initialReduxState: reduxStore.getState(),
    }
  }

  constructor(props) {
    super(props)
    this.reduxStore = getOrCreateStore(props.initialReduxState)
  }

  render() {
    return <App {...this.props} reduxStore={this.reduxStore} />
  }
}
