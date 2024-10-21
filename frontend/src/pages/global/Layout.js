import { Box } from '@mui/material';
import React from 'react'
import HeaderTop from './HeaderTop';
import SidebarAdm from './SideBar';
import Footer from '../../components/Footer';

const Layout = (Component) => ({ ...props }) => {

    return (
        <>
            <div style={{ display: 'flex', minHeight: "100vh" }}>
                <SidebarAdm />
                <Box sx={{ minWidth: "80.45%", bgcolor: "#002952" }}>
                    <HeaderTop />
                    <Box sx={{ p: 3 }}>
                        <Component {...props} />
                    </Box>
                    <Footer />
                </Box>
            </div>
        </>
    )
}

export default Layout