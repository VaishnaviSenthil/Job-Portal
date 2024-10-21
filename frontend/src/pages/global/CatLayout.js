import { Box } from '@mui/material';
import React from 'react'

import SidebarAdm from './SideBar';
import HeaderTop from './HeaderTop';
import HeaderForCategory from './HeaderForCategory';

const CatLayout = (Component) => ({ ...props }) => {

    return (
        <>
            <div style={{ display: 'flex', minHeight: "100vh" }}>
                <SidebarAdm />
                <Box sx={{ width: "100%", bgcolor: "#002952" }}>
                <HeaderForCategory/>
                    <Box sx={{ p: 1 }}>
                        <Component {...props} />
                    </Box>
                    
                </Box>
            </div>
        </>
    )
}

export default CatLayout