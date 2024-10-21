import { Box } from '@mui/material'
import React from 'react'
import Footer from '../components/Footer'
import Navbar from '../components/NavBar'
import NotFoundImage from '../images/404-page.gif';

const NotFound = () => {
  const imageStyles = {
    display: 'block',
    margin: '0 auto',
  };

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ margin: '20px' }}>
        <img src={NotFoundImage} alt="Not Found Image" style={imageStyles} />
      </div>
     
    </div>
    <Footer />
        </>
    )
}

export default NotFound