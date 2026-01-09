import { Box, Toolbar } from '@mui/material';
import React, { useState } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const Layout = () =>{
    const[open, setOpen] = useState(false);

    const toggleDrawer = () => {
        setOpen(prev => !prev);
    };
    const closeDrawer = () => setOpen(false);

    return(
        <Box sx= {{dispaly: "flex", minHeight:"100vh",bgcolor: "background.detail"}}>
            <Header open={open} toggleDrawer={toggleDrawer} />
            <Sidebar open={open} onClose={closeDrawer} />
                <Box component="main" sx= {{flexGrow: 1, p:3, mt:8}}>
                    <Box sx = {{ px: 2, py: 2}}>
                     <Outlet />
                    </Box>
                </Box>
        </Box>
    )   

}

export default Layout;