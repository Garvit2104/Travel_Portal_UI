import {Drawer, List, ListItemButton, ListItemIcon, ListItemText, Toolbar} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import HomeIcon from '@mui/icons-material/Home';
import ListIcon from '@mui/icons-material/List';
import SubwayIcon from '@mui/icons-material/Subway';
import PendingIcon from '@mui/icons-material/Pending';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export interface SidebarProps {
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
      variant='temporary'
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }} // better mobile performance
      sx={{
    width: drawerWidth,
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      bgcolor: "#EEF2FF",
      borderRight: "1px solid #D6DBF5",
    },
  }}
    >

      <List sx={{ px: 1, mt: 1.5 }}>
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
                mx: 1,
                my: 0.3,            // ✅ smaller vertical spacing
                py: 0.8,            // ✅ shrink height
                borderRadius: 1.5,
                fontSize: "0.9rem",
                color: "#1F2A44",

                "&:hover": {
                  bgcolor: "#DCE3FF",
                  transform: "scale(0.98)",   // ✅ hover shrink
                },

                "&.Mui-selected": {
                  bgcolor: "#4F6DFF",
                  color: "#FFFFFF",
                  "& .MuiListItemIcon-root": {
                    color: "#FFFFFF",
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 36,       // ✅ shrink icon spacing
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} 
                  primaryTypographyProps={{
                  fontSize: "0.9rem", // ✅ text smaller
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Drawer>
  );
};

export default Sidebar;
