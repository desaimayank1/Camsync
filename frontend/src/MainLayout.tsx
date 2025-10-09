// MainLayout.tsx
import React, { useState } from "react";
import { Box, IconButton, AppBar, Toolbar, Typography } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

const MainLayout: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <Box sx={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <AppBar
          position="fixed"
          sx={{
            background: "white",
            color: "black",
            boxShadow: "none",
            borderBottom: "1px solid #e0e0e0",
            display: { xs: "flex", md: "none" },
          }}
        >
          <Toolbar>
            <IconButton onClick={toggleSidebar} edge="start" color="inherit" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Security Dashboard
            </Typography>
          </Toolbar>
        </AppBar>
        <Box
          component="main"
          sx={{
            flex: 1,
            backgroundColor: "#f5f6fa",
            mt: { xs: "64px", md: 0 },
            overflowY: "auto",
            p: { xs: 2, md: 3 },
          }}
        >
          <Outlet/>
        </Box>
      </Box>

      {isOpen && (
        <Box
          onClick={toggleSidebar}
          sx={{
            display: { xs: "block", md: "none" },
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
            zIndex: 1100,
          }}
        />
      )}
    </Box>
  );
};

export default MainLayout;
