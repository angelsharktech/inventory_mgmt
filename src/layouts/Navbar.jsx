import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Box,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link } from "react-router-dom";



const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        BillingApp
      </Typography>
      
    </Box>
  );
const drawerWidth = 100;
  return (
    <>
         <AppBar
        position="fixed"
        sx={{
          // ml: { sm: `${drawerWidth}px` },
          // width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#2F4F4F",
         borderBottomRightRadius: 40,
        }}
      >
        <Toolbar sx={{ justifyContent: "flex-end" }}>
          <Typography variant="h4" noWrap component="div" mr={5}>
            Billing Desk
          </Typography>
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
