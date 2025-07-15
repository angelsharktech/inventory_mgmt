// Sidebar.jsx
import React from "react";
import {
  Box,
  Avatar,
  Typography,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Store as StoreIcon,
  Category as CategoryIcon,
  Inventory2 as Inventory2Icon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  ReceiptLong as ReceiptLongIcon,
  Assessment as AssessmentIcon,
  RequestQuote as RequestQuoteIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon /> },
  { label: "Vendors", icon: <StoreIcon /> },
  { label: "Category", icon: <CategoryIcon /> },
  { label: "Product", icon: <Inventory2Icon /> },
  { label: "Purchase Bill", icon: <AccountBalanceWalletIcon /> },
  { label: "Sale Bill", icon: <ReceiptLongIcon /> },
  { label: "Bill Reports", icon: <AssessmentIcon /> },
  { label: "Income Tax Reports", icon: <RequestQuoteIcon /> },
  { label: "Logout", icon: <LogoutIcon /> },
];

const selectedStyle = {
  background: "#fff !important" ,
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
   const navigate = useNavigate();

  const handleNavClick = (label) => {
    if (label === "Logout") {
      localStorage.removeItem("token");
      navigate("/login");
    } else {
      setSelectedTab(label);
    }
  };
  return (
    <Box
      sx={{
        width: 200,
        backgroundColor: "#2F4F4F",
        color: "white",
        height: "100vh",
        borderTopRightRadius: 40,
        borderBottomRightRadius: 40,
        px: 2,
        pt: 3,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <Box textAlign="center" mt={4}>
        <Avatar
          src="https://i.pravatar.cc/150?img=3"
          sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}
        />
        <Typography fontWeight="bold" fontSize={14}>
          ALEX JOHNSON
        </Typography>
        <Typography fontSize={12} color="gray">
          alex.johnson@email.com
        </Typography>
      </Box>

      <Box >
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              selected={selectedTab === item.label}
              onClick={() => handleNavClick(item.label)}
              sx={selectedTab === item.label ? selectedStyle : unselectedStyle}
            >
              <ListItemIcon
                sx={{
                  color: selectedTab === item.label ? selectedStyle : unselectedStyle,
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
      <Box mb={6}></Box>
    </Box>
  );
};

export default Sidebar;
