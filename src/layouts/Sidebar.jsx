import React, { useState } from "react";
import {
  Box,
  Drawer,
  IconButton,
  useMediaQuery,
  useTheme,
  Avatar,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  Inventory2 as Inventory2Icon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ReceiptLong as ReceiptLongIcon,
  Assessment as AssessmentIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  Menu as MenuIcon,
  ExpandLess,
  ExpandMore,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Vendors", icon: <StoreIcon /> },
  { label: "Customer", icon: <PeopleIcon /> },
  { label: "Category", icon: <CategoryIcon /> },
  { label: "Product", icon: <Inventory2Icon /> },
  { label: "Purchase Bill", icon: <AccountBalanceWalletIcon /> },
  { label: "Sale Bill", icon: <ReceiptLongIcon /> },
  { label: "Bill Reports", icon: <AssessmentIcon />, hasDropdown: true },
  { label: "Logout", icon: <LogoutIcon /> },
];

const billReportsSubItems = ["Sale Bill Report", "Purchase Bill Report"];

const selectedStyle = {
  background: "#fff !important",
  color: "#2F4F4F !important",
  borderRadius: "8px",
  fontWeight: 600,
  boxShadow: 2,
};

const unselectedStyle = {
  color: "white",
  borderRadius: "8px",
  fontWeight: 500,
  transition: "background 0.2s",
  "&:hover": {
    backgroundColor: "#fff",
    color: "#2F4F4F",
  },
};

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openReports, setOpenReports] = useState(false);
  const { webuser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  const handleNavClick = (label) => {
    if (label === "Logout") {
      logoutUser();
      navigate("/login");
    } else {
      setSelectedTab(label);
    }
    if (isMobile) toggleDrawer();
  };

  const renderSidebarContent = () => (
    <Box
      sx={{
        width: 200,
        backgroundColor: "#2F4F4F",
        color: "white",
        height: "100%",
        px: 2,
        pt: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
      }}
    >
      <Box textAlign="center" mt={4}>
        <Avatar sx={{ width: 60, height: 60, mx: "auto", mb: 1 }} />
        <Typography fontWeight="bold" fontSize={14}>
          {webuser.first_name}
        </Typography>
        <Typography fontSize={12} color="gray">
          {webuser.email}
        </Typography>
      </Box>

      <Box>
        <List>
          {navItems.map((item) =>
            item.hasDropdown ? (
              <Box key={item.label}>
                <ListItemButton
                  onClick={() => setOpenReports(!openReports)}
                  sx={selectedTab.startsWith("Report") ? selectedStyle : unselectedStyle}
                >
                  <ListItemIcon sx={{ color: selectedTab.startsWith("Report") ? "#2F4F4F" : "white" }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText primary={item.label} />
                  {openReports ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>
                <Collapse in={openReports} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {billReportsSubItems.map((subLabel) => (
                      <ListItemButton
                        key={subLabel}
                        onClick={() => handleNavClick(subLabel)}
                        sx={{
                          ...(
                            selectedTab === subLabel
                              ? selectedStyle
                              : { pl: 4, ...unselectedStyle }
                          ),
                        }}
                      >
                        <ListItemText primary={subLabel} />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </Box>
            ) : (
              <ListItemButton
                key={item.label}
                selected={selectedTab === item.label}
                onClick={() => handleNavClick(item.label)}
                sx={selectedTab === item.label ? selectedStyle : unselectedStyle}
              >
                <ListItemIcon sx={{ color: selectedTab === item.label ? "#2F4F4F" : "white" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            )
          )}
        </List>
      </Box>

      <Box mb={6}></Box>
    </Box>
  );

  return (
    <>
      {isMobile && (
        <Box position="fixed" top={10} left={10} zIndex={1201}>
          <IconButton onClick={toggleDrawer} sx={{ color: "#2F4F4F" }}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      <Drawer anchor="left" open={mobileOpen} onClose={toggleDrawer} ModalProps={{ keepMounted: true }}>
        {renderSidebarContent()}
      </Drawer>

      {!isMobile && (
        <Box sx={{ height: "100vh", zIndex: 1100 }}>
          {renderSidebarContent()}
        </Box>
      )}
    </>
  );
};

export default Sidebar;
