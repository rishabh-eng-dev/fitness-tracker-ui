import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  IconButton,
  Typography,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Dashboard,
  FitnessCenter,
  Schedule,
  History,
  Chat,
  Settings,
  Person,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const menuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard" },
    { text: "Basic Details", icon: <Person />, path: "/user" },
    { text: "Workouts", icon: <FitnessCenter />, path: "/workouts" },
    { text: "Schedule", icon: <Schedule />, path: "/schedule" },
    { text: "History", icon: <History />, path: "/history" },
    { text: "AI Assistant", icon: <Chat />, path: "/chat" },
    { text: "Settings", icon: <Settings />, path: "/settings" },
  ];

  const handleItemClick = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="temporary"
      open={open}
      onClose={onClose}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          width: 240,
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6" noWrap component="div">
            Menu
          </Typography>
          <IconButton onClick={onClose}>
            <MenuIcon />
          </IconButton>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => handleItemClick(item.path)}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
