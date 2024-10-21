import { Box } from '@mui/material';
import React from 'react';
import { isMobile } from 'react-device-detect';
import SidebarAdm from './SideBar';
import HeaderForJob from './HeaderForJob';

const JobsLayout = (Component) => ({ ...props }) => {
  return (
    <>
      <div style={{ display: 'flex', minHeight: '100vh' }}>
        <SidebarAdm />
        <Box
          sx={{
            width: '100%',
            bgcolor: '#002952',
            height: isMobile ? '100vh' : '100vh', // Adjust the height
            overflowY: isMobile ? 'scroll' : 'hidden', // Add vertical scroll for mobile
          }}
        >
          <HeaderForJob />
          <Box sx={{ p: 1 }}>
            <Component {...props} />
          </Box>
        </Box>
      </div>
    </>
  );
};

export default JobsLayout;
