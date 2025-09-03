import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Menu,
  Box,
  TextField,
  MenuItem,
} from "@mui/material";
import { exportToExcel, exportToPDF } from "../shared/Export";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";

// Updated static data with receiver name
const staticStockData = [
  {
    id: 1,
    date: "2023-10-15",
    invoiceNo: "OUT-001",
    receiverName: "John Doe",
    category: "Electronics",
    productName: "Wireless Headphones",
    quantity: 5,
    description: "High-quality wireless headphones with noise cancellation"
  },
  {
    id: 2,
    date: "2023-10-16",
    invoiceNo: "OUT-002",
    receiverName: "Jane Smith",
    category: "Clothing",
    productName: "Cotton T-Shirts",
    quantity: 20,
    description: "100% cotton premium t-shirts for everyday wear"
  },
  {
    id: 3,
    date: "2023-10-17",
    invoiceNo: "OUT-003",
    receiverName: "Robert Johnson",
    category: "Home & Kitchen",
    productName: "Non-Stick Cookware Set",
    quantity: 3,
    description: "10-piece non-stick cookware set for modern kitchen"
  },
  {
    id: 4,
    date: "2023-10-18",
    invoiceNo: "OUT-004",
    receiverName: "Sarah Williams",
    category: "Books",
    productName: "JavaScript Programming Guide",
    quantity: 7,
    description: "Comprehensive guide to modern JavaScript programming"
  },
  {
    id: 5,
    date: "2023-10-19",
    invoiceNo: "OUT-005",
    receiverName: "Michael Brown",
    category: "Fitness",
    productName: "Yoga Mats",
    quantity: 6,
    description: "Eco-friendly yoga mats with non-slip surface"
  }
];

// Updated export columns configuration to include receiver name
const exportColumns = [
  { label: "Date", key: "date" },
  { label: "Inv No", key: "invoiceNo" },
  { label: "Receiver Name", key: "receiverName" },
  { label: "Category", key: "category" },
  { label: "Product Name", key: "productName" },
  { label: "Quantity", key: "quantity" },
  { label: "Description", key: "description" },
];

const StockOutReport = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const openExportMenu = Boolean(anchorEl);

  // Get unique categories for filter dropdown
  const categories = [...new Set(staticStockData.map(item => item.category))];

  // Filter data based on date range and category
  const filteredData = staticStockData.filter(item => {
    const matchesDateRange = 
      (!startDate || item.date >= startDate) && 
      (!endDate || item.date <= endDate);
    
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    
    return matchesDateRange && matchesCategory;
  });

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight={600} mb={2}>
            Stock Out Report
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2} mr={2}>
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              inputProps={{
                min: startDate,
              }}
            />
            <TextField
              select
              label="Category Filter"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories.map((category, index) => (
                <MenuItem key={index} value={category}>
                  {category}
                </MenuItem>
              ))}
            </TextField>
            <Button
              variant="outlined"
              onClick={handleExportClick}
            >
              <GetAppOutlinedIcon titleAccess="Download As" />
            </Button>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={openExportMenu}
          onClose={handleExportClose}
        >
          <MenuItem
            onClick={() => {
              exportToPDF(
                filteredData,
                exportColumns,
                `Stock Out Report - ${categoryFilter || "All Categories"}`
              );
              handleExportClose();
            }}
          >
            PDF
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportToExcel(
                filteredData,
                exportColumns,
                `Stock Out Report - ${categoryFilter || "All Categories"}`
              );
              handleExportClose();
            }}
          >
            Excel
          </MenuItem>
        </Menu>

        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 1200,
            margin: "2px auto",
            maxHeight: 550,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Date</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Inv No</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Receiver Name</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Category</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Product Name</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Description</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.invoiceNo}</TableCell>
                  <TableCell>{item.receiverName}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>{item.description}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default StockOutReport;