import React from 'react'
import Header from './public-components/header'
import Breadcrumb from './public-components/breadcrumb'
import Demographics from './public-components/demographics'
import Footer from './public-components/infofooter'

const Information = () => {
  return (
    <div>
      <Header />
      <Breadcrumb />
      <Demographics />
      <Footer />
    </div>
  )
}

export default Information