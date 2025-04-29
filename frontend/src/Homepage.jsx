import React from 'react';
import Header from './public-components/header';
import Hero from './public-components/hero';
import Announcements from './public-components/announcements';
import Contact from './public-components/contact';
import Footer from './public-components/homefooter';

const Homepage = () => {
  return (
    <div>
      <Header />
      <Hero />
      <Announcements />
      <Contact />
      <Footer />
    </div>
  )
}

export default Homepage
