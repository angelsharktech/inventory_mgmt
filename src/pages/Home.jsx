import React from "react";
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import DashboardStats from "../components/dashboard/DashboardStats";
// import InventoryCircle from "../components/dashboard/InventoryCircle";
import PurchaseBillChart from "../components/dashboard/PurchaseBillChart";
import SaleBillChart from "../components/dashboard/SaleBillChart";
import InventoryStock from "../components/dashboard/InventoryStock";

// Sample chart/table data (replace with API later if needed)
const salesData = [
  { name: "Paid", value: 400 },
  { name: "Pending", value: 200 },
  { name: "Overdue", value: 100 },
];

const COLORS = ["#1976d2", "#ed6c02", "#d32f2f"];

const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 },
];

const inventoryData = [
  { id: 1, item: "Laptop", stock: 25, price: "₹65,000" },
  { id: 2, item: "Keyboard", stock: 50, price: "₹2,000" },
  { id: 3, item: "Mouse", stock: 75, price: "₹800" },
  { id: 4, item: "Monitor", stock: 15, price: "₹15,000" },
];

const Dashboard = () => {
  return (
    <Box p={3} sx={{ bgcolor: "#f5f7fa", minHeight: "100vh" }}>
      <Typography variant="h5" textAlign={"center"} gutterBottom  color="#182848">
        Inventory Dashboard
      </Typography>

      {/* ✅ Stats from API */}
      <Box mb={3} pt={2}>
        <DashboardStats />
      </Box>

      <Box mb={3} display="flex" gap={2}>
        <Box flex={1}>
          <PurchaseBillChart />
        </Box>
        <Box flex={1}>
          <SaleBillChart />
        </Box>
      </Box>

      {/* <Grid container spacing={3}>
        <Grid item xs={12} md={12} lg={12}>
          <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: "100%" }}>
            <InventoryCircle />
          </Paper>
        </Grid>
      </Grid> */}



      {/* Inventory Table */}
      <Box mt={4} sx={{pt:5}}>
       <InventoryStock />
      </Box>
    </Box>
  );
};

export default Dashboard;
