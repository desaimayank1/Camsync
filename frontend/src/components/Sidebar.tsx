import React from "react";
import {
  Home,
  VideoCameraFrontRounded,
  VideoCameraBack,
  Notifications,
  Menu,
  Close,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import { Box, IconButton } from "@mui/material";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const links = [
    { to: "/dashboard", label: "Dashboard", icon: <Home /> },
    { to: "/camera", label: "Camera", icon: <VideoCameraBack /> },
    { to: "/alert", label: "Alert", icon: <Notifications /> },
  ];

  return (
    <>
      <Box
        sx={{
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #e0e0e0",
          backgroundColor: "white",
          position: "fixed",
          width: "100%",
          top: 0,
          zIndex: 1099,
        }}
      >
        <IconButton onClick={toggleSidebar}>
          <Menu />
        </IconButton>
      </Box>

      <Box
        sx={{
          position: { xs: "fixed", md: "relative" },
          left: { xs: isOpen ? 0 : "-288px", md: 0 },
          top: { xs: 0, md: 0 },
          height: "100vh",
          width: "18rem",
          backgroundColor: "white",
          borderRight: "1px solid #e0e0e0",
          transition: "left 0.3s ease",
          zIndex: 1200,
        }}
        className="flex flex-col"
      >
        <Box
          sx={{
            display: { xs: "flex", md: "none" },
            justifyContent: "flex-end",
            p: 1,
          }}
        >
          <IconButton onClick={toggleSidebar}>
            <Close />
          </IconButton>
        </Box>

        {/* Sidebar header */}
        <h1 className="hidden md:flex items-center text-xl font-semibold text-blue-600 p-4 mb-4">
          CamSystem <VideoCameraFrontRounded className="ml-2" />
        </h1>

        {/* Navigation links */}
        <nav className="flex flex-col flex-grow">
          {links.map((link) => (
            <button
              key={link.to}
              onClick={() => {
                navigate(link.to);
                toggleSidebar(); 
              }}
              className={clsx(
                "flex items-center gap-3 mx-3 px-4 py-2 my-1 rounded-3xl transition-all text-gray-700 hover:bg-blue-50",
                location.pathname === link.to &&
                  "!bg-blue-100 !text-blue-700 !font-medium"
              )}
            >
              {link.icon}
              {link.label}
            </button>
          ))}
        </nav>
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
    </>
  );
};

export default Sidebar;
