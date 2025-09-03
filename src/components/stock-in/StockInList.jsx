import React, { useEffect, useState } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  IconButton,
  Button,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem
} from "@mui/material";
import {
  Search,
  Add,
  Delete,
  Edit
} from "@mui/icons-material";
import PaginationComponent from "../shared/PaginationComponent";
import FilterData from "../shared/FilterData";
import AddStockIn from "./AddStockIn";
// import EditStockIn from "./EditStockIn";

const StockInList = () => {
  // Static data for demonstration
  const [stockData, setStockData] = useState([
    {
      id: 1,
      date: '2023-10-15',
      invoiceNo: 'INV-001',
      category: 'Electronics',
      productName: 'Wireless Headphones',
      quantity: 50,
      description: 'High-quality wireless headphones with noise cancellation'
    },
    {
      id: 2,
      date: '2023-10-16',
      invoiceNo: 'INV-002',
      category: 'Clothing',
      productName: 'Cotton T-Shirts',
      quantity: 200,
      description: '100% cotton premium t-shirts for everyday wear'
    },
    {
      id: 3,
      date: '2023-10-17',
      invoiceNo: 'INV-003',
      category: 'Home & Kitchen',
      productName: 'Non-Stick Cookware Set',
      quantity: 35,
      description: '10-piece non-stick cookware set for modern kitchen'
    },
    {
      id: 4,
      date: '2023-10-18',
      invoiceNo: 'INV-004',
      category: 'Books',
      productName: 'JavaScript Programming Guide',
      quantity: 75,
      description: 'Comprehensive guide to modern JavaScript programming'
    },
    {
      id: 5,
      date: '2023-10-19',
      invoiceNo: 'INV-005',
      category: 'Fitness',
      productName: 'Yoga Mats',
      quantity: 60,
      description: 'Eco-friendly yoga mats with non-slip surface'
    },
    {
      id: 6,
      date: '2023-10-20',
      invoiceNo: 'INV-006',
      category: 'Electronics',
      productName: 'Bluetooth Speaker',
      quantity: 40,
      description: 'Portable Bluetooth speaker with 10W output'
    },
    {
      id: 7,
      date: '2023-10-21',
      invoiceNo: 'INV-007',
      category: 'Home & Kitchen',
      productName: 'Air Purifier',
      quantity: 25,
      description: 'HEPA air purifier for rooms up to 30 sqm'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [edit, setEdit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('md'));
  const isExtraSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEdit = () => setEdit(false);

  useEffect(() => {
    if (stockData) {
      setTotalPages(Math.ceil(stockData.length / pageSize));
    }
  }, [stockData]);

  const filteredStock = stockData?.filter(
    (item) =>
      item.invoiceNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    if (filteredStock) {
      setTotalPages(Math.ceil(filteredStock.length / pageSize));
    }
  }, [filteredStock]);

  const paginatedStock = filteredStock?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEdit = (rowData) => {
    setData(rowData);
    setEdit(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this stock entry?")) {
      try {
        setStockData(stockData.filter(item => item.id !== id));
        setSnackbarMessage("Stock Entry Deleted!");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error deleting stock entry", error);
        setSnackbarMessage("Failed to delete stock entry.");
        setSnackbarOpen(true);
      }
    }
  };

  const handleAddStock = (newStock) => {
    const newId = Math.max(...stockData.map(item => item.id), 0) + 1;
    setStockData([...stockData, { id: newId, ...newStock }]);
    setOpen(false);
    setSnackbarMessage("Stock Entry Added!");
    setSnackbarOpen(true);
  };

  const handleUpdateStock = (updatedStock) => {
    setStockData(stockData.map(item => item.id === data.id ? {...updatedStock, id: data.id} : item));
    setEdit(false);
    setSnackbarMessage("Stock Entry Updated!");
    setSnackbarOpen(true);
  };

  // Mobile-friendly stock card component
  const MobileStockCard = ({ stock }) => (
    <Paper sx={{ p: 2, mb: 2, borderRadius: 2, boxShadow: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight="bold">
            {stock.productName}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Invoice: {stock.invoiceNo}
          </Typography>
          <Chip 
            label={stock.category} 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ mt: 0.5 }}
          />
        </Box>
        <Box>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(stock)}
            sx={{ mr: 0.5 }}
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(stock.id)}
          >
            <Delete fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
        <Typography variant="body2">
          <strong>Date:</strong> {stock.date}
        </Typography>
        <Chip 
          label={`Qty: ${stock.quantity}`} 
          color="secondary" 
          size="small"
        />
      </Box>
      <Typography variant="body2" sx={{ mt: 1 }}>
        {stock.description}
      </Typography>
    </Paper>
  );

  return (
    <>
      <Box sx={{ p: isExtraSmallScreen ? 1 : 3 }}>
        {/* Combined header with title, search, and button in one row */}
        <Box
          display="flex"
          flexDirection={isSmallScreen ? "column" : "row"}
          justifyContent="space-between"
          alignItems={isSmallScreen ? "flex-start" : "center"}
          mb={2}
          gap={isSmallScreen ? 2 : 0}
        >
          <Typography variant={isSmallScreen ? "h5" : "h4"} fontWeight={600}>
            Stock In
          </Typography>
          
          {/* Combined search and button container */}
          <Box 
            display="flex" 
            flexDirection={isSmallScreen ? "column" : "row"} 
            alignItems={isSmallScreen ? "stretch" : "center"}
            gap={2}
            width={isSmallScreen ? "100%" : "auto"}
          >
            <Box flexGrow={1} width={isSmallScreen ? "100%" : "auto"} pt={2}>
              <FilterData 
                value={searchQuery} 
                onChange={handleSearchChange} 
                fullWidth={isSmallScreen}
                placeholder="Search by invoice, product or category..."
              />
            </Box>
            <Button
              variant="contained"
              sx={{ 
                background: "linear-gradient(135deg, #182848, #324b84ff)", 
                color: "#fff",
                whiteSpace: 'nowrap',
                width: isSmallScreen ? "100%" : "auto"
              }}
              onClick={handleOpen}
            >
              {isSmallScreen ? "Add Stock" : "Add Stock "}
            </Button>
          </Box>
        </Box>

        {isSmallScreen ? (
          // Mobile view with cards
          <Box>
            {paginatedStock?.map((stock, index) => (
              <MobileStockCard key={index} stock={stock} />
            ))}
          </Box>
        ) : (
          // Desktop view with table
          <TableContainer component={Paper} elevation={3} sx={{ height: '422px' }}>
            <Table>
              <TableHead sx={{ backgroundColor: "lightgrey" }}>
                <TableRow>
                  <TableCell align="center"><strong>Date</strong></TableCell>
                  <TableCell align="center"><strong>Inv No</strong></TableCell>
                  <TableCell align="center"><strong>Category</strong></TableCell>
                  <TableCell align="center"><strong>Product Name</strong></TableCell>
                  <TableCell align="center"><strong>Quantity</strong></TableCell>
                  <TableCell align="center"><strong>Description</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedStock?.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{row.date}</TableCell>
                    <TableCell align="center">{row.invoiceNo}</TableCell>
                    <TableCell align="center">{row.category}</TableCell>
                    <TableCell align="center">{row.productName}</TableCell>
                    <TableCell align="center">{row.quantity}</TableCell>
                    <TableCell align="center" sx={{ maxWidth: '200px' }}>{row.description}</TableCell>
                    <TableCell align="center">
                      {/* <IconButton color="primary" onClick={() => handleEdit(row)}>
                        <Edit />
                      </IconButton> */}
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(row.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={
            snackbarMessage.includes("Deleted") || snackbarMessage.includes("Added") || snackbarMessage.includes("Updated") 
              ? "success" : "error"
          }
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AddStockIn
        open={open}
        handleClose={handleClose}
        handleAddStock={handleAddStock}
      />
      
      {/* <EditStockIn
        open={edit}
        handleClose={handleCloseEdit}
        data={data}
        handleUpdateStock={handleUpdateStock}
      /> */}
      
      {filteredStock && filteredStock.length > 0 && (
        <PaginationComponent
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      )}
    </>
  );
};

export default StockInList;