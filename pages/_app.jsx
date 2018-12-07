import App, { Container } from 'next/app'
import React from 'react'
import { Provider } from 'react-redux'

import Head from 'next/head'
import withReduxStore from '../lib/with-redux-store'
import Navbar from '../components/navbar'

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props

    return (
      <Container>
        <Provider store={reduxStore}>
          <Head>
            <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossOrigin="anonymous" />
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css" integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU" crossOrigin="anonymous" />
          </Head>
          <header>
            <Navbar />
          </header>
          <main>
            <div key="container" className="container mt-4">
              <Component {...pageProps} />
            </div>
          </main>
        </Provider>
      </Container>
    )
  }
}

export default withReduxStore(MyApp)
