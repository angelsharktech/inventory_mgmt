// Dashboard.jsx
import React, { useState } from "react";
import { Box, Toolbar, Grid, Paper, Typography, Stack } from "@mui/material";
import Sidebar from "../layouts/Sidebar";
import Navbar from "../layouts/Navbar";
import Vendors from "../components/Vendors";

import { styled } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Category from "../components/Category";
import Product from "../components/Product";
import Customer from "../components/Customer";
import SaleBill from "../components/SaleBill";
import PurchaseBill from "../components/PurchaseBill";
import SaleBillReport from "../components/reports/SaleBillReport";
import PurchaseBillReport from "../components/reports/PurchaseBillReport";

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: 10,
  boxShadow: theme.shadows[3],
}));

const StatCard = ({ title, value, icon, color }) => (
  <Item sx={{ backgroundColor: color, color: "white" }}>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box sx={{ width: "120px", height: "100px" }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </Box>
      {icon}
    </Box>
  </Item>
);

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedTab) {
      case "Dashboard":
        const chartData = [
          { name: "Jan", Sale: 4000, Purchase: 2400 },
          { name: "Feb", Sale: 3000, Purchase: 1398 },
          { name: "Mar", Sale: 2000, Purchase: 9800 },
          { name: "Apr", Sale: 2780, Purchase: 3908 },
          { name: "May", Sale: 1890, Purchase: 4800 },
          { name: "Jun", Sale: 2390, Purchase: 3800 },
          { name: "Jul", Sale: 3490, Purchase: 4300 },
        ];
        return (
          <>
            <Box sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Organization Overview
              </Typography>
              <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard
                    title="Vendors"
                    value="32"
                    icon={<StoreIcon sx={{ fontSize: 50 }} />}
                    color="#1976d2"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard
                    title="Customers"
                    value="120"
                    icon={<PeopleIcon sx={{ fontSize: 50 }} />}
                    color="#388e3c"
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                  <StatCard
                    title="Products"
                    value="245"
                    icon={<Inventory2Icon sx={{ fontSize: 50 }} />}
                    color="#fbc02d"
                  />
                </Grid>
              </Grid>

              {/* Bar Charts Section */}
              <Grid container spacing={30}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 2, width: "200%" }}>
                    <Typography variant="h6" gutterBottom>
                      Sale Overview
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={chartData}
                        barCategoryGap="10%" // Adjusts gap between categories (bars)
                        barSize={30} // Adjusts width of each bar
                      >
                        <defs>
                          <linearGradient
                            id="blueGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#3477eb" />
                            <stop offset="100%" stopColor="#25f5ee" />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Sale" fill="url(#blueGradient)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 3, borderRadius: 2, width: "200%" }}>
                    <Typography variant="h6" gutterBottom>
                      Purchase Overview
                    </Typography>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart
                        data={chartData}
                        barCategoryGap="10%"
                        barSize={30}
                      >
                        <defs>
                          <linearGradient
                            id="yellowGradient"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#f5f125" />
                            <stop offset="100%" stopColor="#9ff01d" />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Purchase" fill="url(#yellowGradient)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          </>
        );
      case "Vendors":
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
