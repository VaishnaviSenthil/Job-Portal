import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import ViewSidebarIcon from '@mui/icons-material/ViewSidebar';
import SearchIcon from '@mui/icons-material/Search';
import { useProSidebar } from 'react-pro-sidebar';
import { useTheme } from '@emotion/react';
import { useDispatch, useSelector } from 'react-redux';
import { isMobile } from 'react-device-detect';

const HeaderForJob = () => {

    const { collapseSidebar } = useProSidebar();
    const { userInfo } = useSelector(state => state.signIn);
    

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static" sx={{ boxShadow: 0, bgcolor: "primary.main" }}>
                <Toolbar>
                    <IconButton onClick={() => collapseSidebar()}
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="open drawer"
                        sx={{ mr: 2 }}
                    >
                        <ViewSidebarIcon />
                    </IconButton>
                    {isMobile ?(<Typography
                      variant='h6'
                    >
                        Jobs Section ! 
                    </Typography>):(<Typography
                        variant="h6"
                        noWrap
                        component="div"
                        sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                    >
                        Jobs Section !
                    </Typography>)}

                    
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default HeaderForJob;