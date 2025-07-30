// Dashboard.jsx
import React, { useState } from "react";
import { Box, Toolbar, Grid, Paper, Typography, Stack } from "@mui/material";
import Sidebar from "../layouts/Sidebar";
import Navbar from "../layouts/Navbar";
import Vendors from "../components/Vendors";
import Category from "../components/Category";
import Product from "../components/Product";
import Customer from "../components/Customer";
import SaleBill from "../components/SaleBill";
import PurchaseBill from "../components/PurchaseBill";
import SaleBillReport from "../components/reports/SaleBillReport";
import PurchaseBillReport from "../components/reports/PurchaseBillReport";
import Home from "./Home";



const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedTab) {

      case "Dashboard":       
        return <Home setSelectedTab={setSelectedTab}/>;

      case "Suppliers":
        return <Vendors />;

      case "Customer":
        return <Customer />;

      case "Category":
        return <Category />;

      case "Product":
        return <Product />;

      case "Purchase Bill":
        return <PurchaseBill />;

      case "Sale Bill":
        return <SaleBill />;

      case "Sale Bill Report":
        return <SaleBillReport/>

      case "Purchase Bill Report":
        return <PurchaseBillReport/>

      case "Income Tax Reports":

      default:
        return <h2></h2>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar />
      <Sidebar selectedTab={selectedTab} setSelectedTab={setSelectedTab} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          bgcolor: "#f9f9f9",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        {renderContent()}
      </Box>
    </Box>
  );
};

export default Dashboard;
