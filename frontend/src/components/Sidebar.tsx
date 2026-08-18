import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import HomeIcon from "@mui/icons-material/Home";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import PeopleIcon from "@mui/icons-material/People";
import PaymentIcon from "@mui/icons-material/Payment";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import CampaignIcon from "@mui/icons-material/Campaign";

import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const drawerWidth = 250;

const Sidebar = ({ open, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      label: "Dashboard",
      path: "/admin/dashboard",
      icon: <DashboardIcon />,
    },
    {
      label: "PG Management",
      path: "/admin/pg",
      icon: <HomeIcon />,
    },
    {
      label: "Room Management",
      path: "/admin/rooms",
      icon: <MeetingRoomIcon />,
    },
    {
      label: "Tenants",
      path: "/admin/tenants",
      icon: <PeopleIcon />,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: <PaymentIcon />,
    },
    {
      label: "Complaints",
      path: "/admin/complaints",
      icon: <ReportProblemIcon />,
    },
    {
      label: "Announcements",
      path: "/admin/announcements",
      icon: <CampaignIcon />,
    },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    onClose();
  };

  return (
    <Drawer
      variant="persistent"
      anchor="left"
      open={open}
      onClose={onClose}
      sx={{
        zIndex: 1200,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          marginTop: "64px",
          backgroundColor: "#6D28D9",
          borderRight: "none",
          color: "#FFFFFF",
        },
      }}
    >
      <Box sx={{ p: 2 }}>
        <List>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;

            return (
              <ListItemButton
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  mb: 0.5,
                  borderRadius: 2,
                  color: isActive ? "#FFFFFF" : "#EDE9FE",
                  backgroundColor: isActive ? "#8B5CF6" : "transparent",
                  "&:hover": {
                    backgroundColor: isActive ? "#8B5CF6" : "#7C3AED",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 40,
                    color: isActive ? "#FFFFFF" : "#DDD6FE",
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.label}
                  slotProps={{
                    primary: {
                      sx: {
                        fontSize: "0.95rem",
                        fontWeight: isActive ? 600 : 500,
                      },
                    },
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

export { drawerWidth };
