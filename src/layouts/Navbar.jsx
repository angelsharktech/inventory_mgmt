import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  Box,
  Menu,
  MenuItem,
  Avatar,
  Divider,
  styled,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Styled Menu for attractive UI
const StyledMenu = styled((props) => (
  <Menu
    elevation={4}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 12,
    minWidth: 180,
    padding: theme.spacing(1, 0),
    boxShadow:
      "rgba(0, 0, 0, 0.25) 0px 8px 16px, rgba(0, 0, 0, 0.12) 0px 6px 6px",
  },
}));

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const { webuser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    logoutUser();
    navigate("/login");
    handleMenuClose();
  };

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        BillingApp
      </Typography>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          background: "linear-gradient(135deg, #182848, #324b84ff)",
          color: "#fff",
          borderBottomRightRadius: 40,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h4" noWrap component="div" ml={2}>
            Angel Billing
          </Typography>

          {/* Profile Icon */}
          <IconButton onClick={handleMenuOpen} sx={{ p: 0, mr: 2 }}>
            {webuser?.profile_picture ? (
              <Avatar alt="Profile" src={webuser.profile_picture} />
            ) : (
              <Avatar sx={{background: "linear-gradient(135deg, #274278ff, #324b84ff)"}}>
             <AccountCircleIcon/>
              </Avatar>
            )}
          </IconButton>

          <StyledMenu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <Box sx={{ px: 2, py: 1, display: "flex", alignItems: "center" }}>
              <Avatar
                src={webuser?.profile_picture || ""}
                sx={{ mr: 1, bgcolor: "#1976d2" }}
              >
                {webuser?.name?.charAt(0) || "U"}
              </Avatar>
              <Box>
                <Typography variant="subtitle1">{webuser?.name || "User"}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {webuser?.first_name || ""} {webuser?.last_name || ""}
                </Typography>

              </Box>
            </Box>

            <Divider sx={{ my: 1 }} />

            <MenuItem onClick={handleProfileClick}>
              <ListItemIcon>
                <AccountCircleIcon fontSize="small" sx={{color: "#182848",}}/>
              </ListItemIcon>
              Profile
            </MenuItem>

            <MenuItem onClick={handleLogoutClick}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" sx={{color: "red",}}/>
              </ListItemIcon>
              Logout
            </MenuItem>
          </StyledMenu>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  );
};

export default Navbar;
