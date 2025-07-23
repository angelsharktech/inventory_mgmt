// Dashboard.jsx
import React, { useState } from "react";
import { Box, Toolbar, Grid, Paper, Typography, Stack } from "@mui/material";
import Sidebar from "../layouts/Sidebar";
import Navbar from "../layouts/Navbar";
import Vendors from "../components/Vendors";

import { styled } from "@mui/material/styles";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import BarChartIcon from "@mui/icons-material/BarChart";
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
      <Box>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </Box>
      {icon}
    </Box>
  </Item>
);

const salesPurchaseData = [
  { name: "Purchase", value: 85 },
  { name: "Sale", value: 134 },
];
const monthlySales = [
  { month: "Jan", sales: 4000 },
  { month: "Feb", sales: 3000 },
  { month: "Mar", sales: 5000 },
  { month: "Apr", sales: 4000 },
  { month: "May", sales: 6000 },
  { month: "Jun", sales: 7000 },
];

const monthlyPurchases = [
  { month: "Jan", purchases: 2000 },
  { month: "Feb", purchases: 2500 },
  { month: "Mar", purchases: 3500 },
  { month: "Apr", purchases: 3000 },
  { month: "May", purchases: 4000 },
  { month: "Jun", purchases: 4200 },
  { month: "Jul", purchases: 4300 },
  { month: "Aug", purchases: 4600 },
  { month: "Sep", purchases: 4800 },
  { month: "Oct", purchases: 5000 },
  { month: "Nov", purchases: 5100 },
  { month: "Dec", purchases: 5300 },
];

const COLORS = ["#0088FE", "#00C49F"];

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("Dashboard");

  const renderContent = () => {
    switch (selectedTab) {
      case "Dashboard":
        return (
          <>
            {/* <Box sx={{ p: 4 }}>
              <Typography variant="h4" gutterBottom fontWeight={600}>
                Dashboard Overview
              </Typography>
              <Grid container spacing={3}>
                <Stack direction={"column"}>
                  <Stack direction={"row"} gap={15} mb={5}>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        title="Total Products"
                        value="1,245"
                        icon={<PeopleIcon sx={{ fontSize: 50 }} />}
                        color="#4caf50"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        title="Total Sales"
                        value="$89,120"
                        icon={<ShoppingCartIcon sx={{ fontSize: 50 }} />}
                        color="#2196f3"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        title="Reports"
                        value="28 New"
                        icon={<BarChartIcon sx={{ fontSize: 50 }} />}
                        color="#ff9800"
                      />
                    </Grid>
                  </Stack>
                  Monthly Sales Chart
                  <Stack direction={"row"} gap={15}>
                    <Grid item xs={12} md={6}>
                      <Item
                        sx={{
                          background:
                            "linear-gradient(to right, #1e3c72, #2a5298)",
                          color: "white",
                        }}
                      >
                        <Typography variant="h6" mb={2} sx={{ color: "white" }}>
                          Monthly Sales
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={monthlySales}
                            margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
                            barCategoryGap={25}
                          >
                            <defs>
                              <linearGradient
                                id="colorSales"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#00c6ff"
                                  stopOpacity={1}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#0072ff"
                                  stopOpacity={0.8}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="month"
                              stroke="#fff"
                              interval={0}
                              angle={-30}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis stroke="#fff" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#2a5298",
                                border: "none",
                                color: "#fff",
                              }}
                              formatter={(value) => [`$${value}`, "Sales"]}
                            />
                            <Bar
                              dataKey="sales"
                              fill="url(#colorSales)"
                              barSize={40}
                              radius={[10, 10, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Item>
                    </Grid>

                    Monthly Purchase Chart
                    <Grid item xs={12} md={6}>
                      <Item
                        sx={{
                          background:
                            "linear-gradient(to right, #134E5E, #71B280)",
                          color: "white",
                        }}
                      >
                        <Typography variant="h6" mb={2} sx={{ color: "white" }}>
                          Monthly Purchases - Professional View
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart
                            data={monthlyPurchases}
                            margin={{ top: 20, right: 20, left: 0, bottom: 50 }}
                            barCategoryGap={25}
                          >
                            <defs>
                              <linearGradient
                                id="colorPurchases"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                              >
                                <stop
                                  offset="0%"
                                  stopColor="#43cea2"
                                  stopOpacity={1}
                                />
                                <stop
                                  offset="100%"
                                  stopColor="#185a9d"
                                  stopOpacity={0.8}
                                />
                              </linearGradient>
                            </defs>
                            <XAxis
                              dataKey="month"
                              stroke="#fff"
                              interval={0}
                              angle={-30}
                              textAnchor="end"
                              height={60}
                            />
                            <YAxis stroke="#fff" />
                            <Tooltip
                              contentStyle={{
                                backgroundColor: "#185a9d",
                                border: "none",
                                color: "#fff",
                              }}
                              formatter={(value) => [`$${value}`, "Purchases"]}
                            />
                            <Bar
                              dataKey="purchases"
                              fill="url(#colorPurchases)"
                              barSize={40}
                              radius={[10, 10, 0, 0]}
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </Item>
                    </Grid>

                    Sales vs Purchase Comparison
                    <Grid item xs={12} md={6}>
                      <Item>
                        <Typography variant="h6" mb={2}>
                          Sales vs Purchase - Bar Chart
                        </Typography>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={salesPurchaseData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="value" fill="#8884d8" />
                          </BarChart>
                        </ResponsiveContainer>
                      </Item>
                    </Grid>
                  </Stack>
                </Stack>
              </Grid>
            </Box> */}
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
        return <PurchaseBill/>;

      case "Sale Bill":
        return <SaleBill />;

      case "Bill Reports":

      case "Income Tax Reports":

      default:
        return <h2></h2>;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar/>
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
