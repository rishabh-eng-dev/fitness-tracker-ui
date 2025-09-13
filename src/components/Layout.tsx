import React, { useState } from "react";
import {
  Box,
  IconButton,
  // useTheme, useMediaQuery
} from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // const theme = useTheme();
  // const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const handleSidebarToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />

      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Hamburger Menu Icon */}
        {!sidebarOpen && ( // Hide the button when the sidebar is open
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleSidebarToggle}
            sx={{ position: "fixed", top: 12, left: 20, zIndex: 1300 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Sidebar */}
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
            ml: { sm: "240px" },
            mt: { xs: 7, sm: 0 }, // Account for mobile header
          }}
        >
          {children}
        </Box>
      </Box>

      <Footer />
    </Box>
  );
};

export default Layout;
