import { Box, CssBaseline, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () =>{

    const theme = useTheme();
    const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

    const[open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen(prev => !prev);
    };
    const closeDrawer = () => setOpen(false);

    return(
        <Box>
            <CssBaseline />
            <Header 
                open={open} 
                toggleDrawer={toggleDrawer} 
            />
            <Sidebar
                open={open} 
                onClose={closeDrawer}/>
                <Box component="main" 
                    sx={{
                        mt: "64px",
                        p: 3,
                    }}>
                    <Box sx = {{ px: 2, py: 2}}>
                     <Outlet />
                    </Box>
                </Box>
        </Box>  
    )   

}

export default Layout;