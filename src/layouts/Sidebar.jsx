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
  Toolbar,
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
  { label: "Bill Reports", icon: <AssessmentIcon /> },
  // { label: "Income Tax Reports", icon: <RequestQuoteIcon /> },
  { label: "Logout", icon: <LogoutIcon /> },
];

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

// const Sidebar = ({ selectedTab, setSelectedTab }) => {
//     const {webuser, logoutUser } = useAuth();
//    const navigate = useNavigate();

//   const handleNavClick = (label) => {
//     if (label === "Logout") {
//      logoutUser();
//       navigate("/login");
//     } else {
//       setSelectedTab(label);
//     }
//   };
//   return (
//     <Box
//       sx={{
//         width: 200,
//         backgroundColor: "#2F4F4F",
//         color: "white",
//         height: "100vh",
//         borderTopRightRadius: 40,
//         borderBottomRightRadius: 40,
//         px: 2,
//         pt: 3,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "space-between",
//       }}
//     >
//       <Box textAlign="center" mt={4}>
//         <Avatar
//           src=""
//           sx={{ width: 60, height: 60, mx: "auto", mb: 1 }}
//         />
//         <Typography fontWeight="bold" fontSize={14}>
//           {webuser.first_name }
//           {/* {webuser.first_name +" "+ webuser.last_name} */}
//         </Typography>
//         <Typography fontSize={12} color="gray">
//          {webuser.email}
//         </Typography>
//       </Box>

//       <Box >
//         <List>
//           {navItems.map((item) => (
//             <ListItemButton
//               key={item.label}
//               selected={selectedTab === item.label}
//               onClick={() => handleNavClick(item.label)}
//               sx={selectedTab === item.label ? selectedStyle : unselectedStyle}
//             >
//               <ListItemIcon
//                 sx={{
//                   color: selectedTab === item.label ? selectedStyle : unselectedStyle,
//                 }}
//               >
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText primary={item.label} />
//             </ListItemButton>
//           ))}
//         </List>
//       </Box>
//       <Box mb={6}></Box>
//     </Box>
//   );
// };

// export default Sidebar;

const Sidebar = ({ selectedTab, setSelectedTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { webuser, logoutUser } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

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
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              selected={selectedTab === item.label}
              onClick={() => handleNavClick(item.label)}
              sx={selectedTab === item.label ? selectedStyle : unselectedStyle}
            >
              <ListItemIcon
                sx={{
                  color: selectedTab === item.label ? "#2F4F4F" : "white",
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

  return (
    <>
      {isMobile && (
        <Box position="fixed" top={10} left={10} zIndex={1201}>
          <IconButton onClick={toggleDrawer} sx={{ color: "#2F4F4F" }}>
            <MenuIcon />
          </IconButton>
        </Box>
      )}

      {/* Drawer for mobile */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        ModalProps={{ keepMounted: true }}
      >
        {renderSidebarContent()}
      </Drawer>

      {/* Static sidebar for desktop */}
      {!isMobile && (
        <Box
          sx={{
            // width: 200,
            height: "100vh",
            // position: "fixed",
            zIndex: 1100,
          }}
        >
          {renderSidebarContent()}
        </Box>
      )}
    </>
  );
};

export default Sidebar;
