import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Chip,
  Box,
  Button,
  IconButton,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PrintIcon from "@mui/icons-material/Print";
import { deleteProduct, getAllProducts } from "../../services/ProductService";
import AddProduct from "./AddProduct";
import EditProduct from "./EditProduct";
import BarcodePrinter from "./BarcodePrinter";
import Pagination from "../shared/PaginationComponent";
import { exportColumns, exportToExcel, exportToPDF } from "../shared/Export";
import FilterData from "../shared/FilterData";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [edit, setEdit] = useState(false);
  const [code, setCode] = useState();
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const openExportMenu = Boolean(anchorEl);
  const [searchQuery, setSearchQuery] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEdit = () => setEdit(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
      setTotalPages(data.pages);
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };
  const handleEdit = (rowData) => {
    setData(rowData);
    setEdit(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await deleteProduct(id);
        if (res) {
          setSnackbarMessage("Product Deleted!");
          setSnackbarOpen(true);
          fetchProducts(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting product", error);
        alert("Failed to delete product.");
      }
    }
  };

  const handlePrint = async (prod) => {
    try {
      setCode(prod);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredProducts = products.data?.filter(
    (prod) =>
      prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      prod.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <Typography variant="h4" fontWeight={600}>
            Products
          </Typography>
          <FilterData value={searchQuery} onChange={handleSearchChange} />
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
            onClick={handleOpen}
          >
            Add Product
          </Button>

          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={handleExportClick}
            endIcon={<MoreVertIcon />}
          >
            Export As
          </Button>
        </Box>
        <Menu
          anchorEl={anchorEl}
          open={openExportMenu}
          onClose={handleExportClose}
        >
          <MenuItem
            onClick={() => {
              exportToPDF(products.data, exportColumns, "Products");
              handleExportClose();
            }}
          >
            PDF
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportToExcel(products.data, exportColumns, "Products");
              handleExportClose();
            }}
          >
            Excel
          </MenuItem>
        </Menu>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Short Description</TableCell>
                <TableCell>Price ($)</TableCell>
                <TableCell>Compare Price ($)</TableCell>
                <TableCell>Discount (%)</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Tags</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
                <TableCell>Print</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredProducts?.map((prod) => (
                <TableRow key={prod._id}>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.shortDescription}</TableCell>
                  <TableCell>{prod.price}</TableCell>
                  <TableCell>{prod.compareAtPrice}</TableCell>
                  <TableCell>{prod.discountPercentage}%</TableCell>
                  <TableCell>{prod.sku}</TableCell>
                  <TableCell>{prod.quantity}</TableCell>
                  <TableCell>
                    <Chip
                      label={prod.status}
                      color={prod.status === "active" ? "success" : "default"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {prod.tags.map((tag, index) => (
                      <Chip
                        key={index}
                        label={tag}
                        size="small"
                        sx={{ m: 0.5 }}
                      />
                    ))}
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(prod)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(prod._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="inherit"
                      onClick={() => handlePrint(prod)}
                    >
                      <PrintIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={
            snackbarMessage === "Product Deleted!" ? "success" : "error"
          }
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AddProduct
        open={open}
        handleClose={handleClose}
        refresh={fetchProducts}
      />

      <EditProduct
        open={edit}
        data={data}
        handleCloseEdit={handleCloseEdit}
        refresh={fetchProducts}
      />

      <Pagination
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <BarcodePrinter product={code} />
    </>
  );
};

export default ProductList;
