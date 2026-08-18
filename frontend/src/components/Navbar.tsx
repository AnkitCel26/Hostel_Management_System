import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";

import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

import AuthContext from "../context/AuthContext";
import { LOGOUT_USER } from "../graphql/auth.api";

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const navigate = useNavigate();

  const { user, setUser } = useContext(AuthContext)!;

  const [anchorElUser, setAnchorElUser] =
    useState<null | HTMLElement>(null);

  const [logoutUser, { loading }] = useMutation(LOGOUT_USER);

  const handleOpenUserMenu = (
    event: React.MouseEvent<HTMLElement>,
  ) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleProfile = () => {
    handleCloseUserMenu();
    navigate("/profile");
  };

  const handleLogout = async () => {
    handleCloseUserMenu();

    try {
      await logoutUser();

      setUser(null);

      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AppBar
      position="fixed"
      elevation={1}
      sx={{
        zIndex: 1201,
        backgroundColor: "#4C1D95",
        color: "#FFFFFF",
      }}
    >
      <Toolbar>
        <IconButton
          onClick={onMenuClick}
          sx={{
            mr: 2,
            color: "#FFFFFF",
            "&:hover": {
              backgroundColor: "#5B21B6",
            },
          }}
        >
          <MenuIcon />
        </IconButton>

        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: "#FFFFFF",
            flexGrow: 1,
          }}
        >
          Hostel Management
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Tooltip title="Account">
            <IconButton
              onClick={handleOpenUserMenu}
              sx={{
                p: 0,
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              <Avatar
                sx={{
                  width: 40,
                  height: 40,
                  backgroundColor: "#7C3AED",
                  color: "#FFFFFF",
                }}
              >
                {user?.name?.charAt(0).toUpperCase() || "U"}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Typography
            sx={{
              fontSize: 16,
              fontWeight: 500,
              color: "#FFFFFF",
            }}
          >
            {user?.name}
          </Typography>

          <Menu
            anchorEl={anchorElUser}
            open={Boolean(anchorElUser)}
            onClose={handleCloseUserMenu}
            sx={{ mt: 1 }}
          >
            <MenuItem onClick={handleProfile}>
              Profile
            </MenuItem>

            <MenuItem
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? "Logging out..." : "Logout"}
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;