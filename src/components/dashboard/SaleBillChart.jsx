// src/components/dashboard/SaleBillChart.jsx
import React from "react";
import { Paper, Typography } from "@mui/material";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";

const saleData = [
  { month: "Jan", stock: 2400 },
  { month: "Feb", stock: 1398 },
  { month: "Mar", stock: 9800 },
  { month: "Apr", stock: 3908 },
  { month: "May", stock: 4800 },
  { month: "Jun", stock: 3800 },
  { month: "Jul", stock: 4300 },
];

const SaleBillChart = () => (
  <Paper
    sx={{
      p: 3,
      borderRadius: 3,
      boxShadow: 4,
      height: "100%",
      background: "#fff",
    }}
  >
    <Typography variant="h6" gutterBottom fontWeight="600" color="#182848">
      Stock Out
    </Typography>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={saleData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip
          contentStyle={{
            borderRadius: 8,
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        />
        <Legend />
        <Bar dataKey="stock" fill="#43a047" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export default SaleBillChart;
