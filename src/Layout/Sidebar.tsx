import {Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import SubwayIcon from '@mui/icons-material/Subway';
import PendingIcon from '@mui/icons-material/Pending';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 260;

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}
const Sidebar = ({open, onClose} : SidebarProps) => {
    const navItems = [
        { text: 'Home', path: '/', icon: <HomeIcon /> },
        { text: 'Add New Employee', path: '/add-employee', icon: <PersonAddIcon /> },
        { text: 'Employees Detail', path: '/employee-detail', icon: <ListIcon /> },
        { text: 'Create New Request', path: '/new-travel-request', icon: <SubwayIcon /> },
        { text: 'UnApproved Request', path: '/pending-travel-request', icon: <PendingIcon /> },
      ];

    const location = useLocation();
    
return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }} // better mobile performance
      sx={{
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          top: '68px', // height of AppBar with default Toolbar on desktop
          height: 'calc(100% - 68px)',
        },
      }}
    >
     
      <List sx={{ px: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <ListItemButton
              key={item.text}
              component={NavLink}
              to={item.path}
              onClick={onClose} // close drawer after navigation
              selected={isActive}
              sx={{
                mb: 0.5,
                mt: 0.5,
                borderRadius: 1,
                '&.active, &[aria-selected="true"]': {
                  bgcolor: 'action.selected',
                },
              }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
