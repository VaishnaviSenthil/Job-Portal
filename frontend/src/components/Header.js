import React, { useState, useEffect } from 'react';
import { Box, styled } from '@mui/material';
import headerImage1 from '../images/jobBBg.jpg'; 
import headerImage2 from '../images/jobBg4.jpg'; 


const Header = () => {
  const images = [headerImage1,headerImage2]; 

  const [currentIndex, setCurrentIndex] = useState(0);

  const StyledHeader = styled(Box)(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    minHeight: 200,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundColor: theme.palette.secondary.main,
    opacity: 1,
    transition: 'opacity 1s ease-in-out',
    backgroundImage: `url(${images[currentIndex]})`,
  }));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [images]);

  return (
    <>
      <StyledHeader />
    </>
  );
};

export default Header;
