
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

// Static data for the stock report
const staticStockData = [
  {
    id: 1,
    date: "2023-08-05",
    invoiceNo: "INV-001",
    category: "Electronics",
    productName: "Laptop",
    quantity: 5,
    description: "High-performance business laptop"
  },
  {
    id: 2,
    date: "2023-08-16",
    invoiceNo: "INV-002",
    category: "Furniture",
    productName: "Office Chair",
    quantity: 12,
    description: "Ergonomic office chair with lumbar support"
  },
  {
    id: 3,
    date: "2023-08-07",
    invoiceNo: "INV-003",
    category: "Stationery",
    productName: "Notebooks",
    quantity: 50,
    description: "Set of 5 premium quality notebooks"
  },
  {
    id: 4,
    date: "2023-08-23",
    invoiceNo: "INV-004",
    category: "Electronics",
    productName: "Monitor",
    quantity: 8,
    description: "27-inch 4K monitor"
  },
  {
    id: 5,
    date: "2023-09-01",
    invoiceNo: "INV-005",
    category: "Software",
    productName: "Office Suite",
    quantity: 15,
    description: "Productivity software license"
  }
];

// Export columns configuration
const exportColumns = [
  { label: "Date", key: "date" },
  { label: "Inv No", key: "invoiceNo" },
  { label: "Category", key: "category" },
  { label: "Product Name", key: "productName" },
  { label: "Quantity", key: "quantity" },
  { label: "Description", key: "description" },
];

const StockInReport = () => {
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
            Stock Report
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
                `Stock Report - ${categoryFilter || "All Categories"}`
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
                `Stock Report - ${categoryFilter || "All Categories"}`
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
            maxWidth: 1100,
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
              {filteredData.map((item, index) => (
                <TableRow key={item.id}>
                  <TableCell>{item.date}</TableCell>
                  <TableCell>{item.invoiceNo}</TableCell>
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

export default StockInReport;