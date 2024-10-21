import { Box } from '@mui/material';
import React from 'react'

import SidebarAdm from './SideBar';
import HeaderTop from './HeaderTop';

const AppliedLayout = (Component) => ({ ...props }) => {

    return (
        <>
            <div style={{ display: 'flex', minHeight: "100vh" }}>
                <SidebarAdm />
                <Box sx={{ width: "100%", bgcolor: "#002952" }}>
                <HeaderTop />
                    <Box sx={{ p: 1 }}>
                        <Component {...props} />
                    </Box>
                    
                </Box>
            </div>
        </>
    )
}

export default AppliedLayout