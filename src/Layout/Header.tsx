import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';


interface HeaderProps {
    open: boolean;
    toggleDrawer: () => void;
}
const Header = ({open, toggleDrawer} : HeaderProps) =>{
    const navigate = useNavigate();

    return(
        <AppBar position="fixed"  elevation={1}
            sx={{bgcolor: "#1F2A44", zIndex: (theme) => theme.zIndex.drawer + 1,
            }}
        >
            <Toolbar>
                <IconButton edge="start"
                            color="inherit"
                            aria-label="open drawer"
                            onClick={toggleDrawer}
                            sx={{ ml: 2 }}
                >
                    {open ? <CloseIcon sx= {{fontSize: 30}} /> : <MenuIcon sx= {{fontSize: 40}}/>}
                </IconButton>
                <Typography variant="h6" sx = {{ml:2, fontWeight: 800, cursor: 'pointer'}}
                    onClick={() => navigate('/')}>
                    EasyGO..
                </Typography>
            <Box sx={{ flexGrow: 1 }} />
            <IconButton
                edge="end"
                color="inherit"
                aria-label="account of current user"
                onClick={() => navigate('/')}
            >
            <HomeIcon sx={{ fontSize: 40 }} /> 
            </IconButton> 
            <IconButton
                edge="end"
                color="inherit"
                sx={{ mr: 2 }}
                aria-label="account of current user"
            >
            <AccountCircle sx={{ fontSize: 40 }} />
            </IconButton>
        </Toolbar>
        </AppBar>
    )
}

export default Header;