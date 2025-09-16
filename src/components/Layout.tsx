import React, { useState } from "react";
import {
  Box,
  // useTheme, useMediaQuery
} from "@mui/material";
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
      <Header
        sidebarOpen={sidebarOpen}
        handleSidebarToggle={handleSidebarToggle}
      />

      <Box sx={{ display: "flex", flex: 1 }}>
        <Sidebar open={sidebarOpen} onClose={handleSidebarClose} />

        {/* Main content */}
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { sm: `calc(100% - 240px)` },
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
