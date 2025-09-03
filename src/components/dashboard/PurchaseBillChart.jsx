// src/components/dashboard/PurchaseBillChart.jsx
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

const purchaseData = [
  { month: "Jan", stock: 4000 },
  { month: "Feb", stock: 3000 },
  { month: "Mar", stock: 2000 },
  { month: "Apr", stock: 2780 },
  { month: "May", stock: 1890 },
  { month: "Jun", stock: 2390 },
  { month: "Jul", stock: 3490 },
];

const PurchaseBillChart = () => (
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
      Stock In
    </Typography>

    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={purchaseData}>
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
        <Bar dataKey="stock" fill="#0288d1" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </Paper>
);

export default PurchaseBillChart;
