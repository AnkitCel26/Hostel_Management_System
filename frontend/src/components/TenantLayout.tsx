import { useState } from "react";
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "./Navbar";
import  { drawerWidth } from "./Sidebar";
import TenantSidebar from "./TenantSidebar";

const TenantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleMenuClick = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar onMenuClick={handleMenuClick} />

      <TenantSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          pt: "88px",
          ml: sidebarOpen ? `${drawerWidth}px` : 0,
          transition: "margin-left 0.2s ease",
          bgcolor: "#f0f0f0",
          minHeight: "100vh",
          boxSizing: "border-box",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default TenantLayout;
