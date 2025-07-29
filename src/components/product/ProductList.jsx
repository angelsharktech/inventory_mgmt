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
import PaginationComponent from "../shared/PaginationComponent";
import { exportToExcel, exportToPDF } from "../shared/Export";
import FilterData from "../shared/FilterData";

const exportColumns = [
  { label: "HSN Code", key: "hsnCode" },
  { label: "Name", key: "name" },
  { label: "Short Description", key: "shortDescription" },
  { label: "Price", key: "price" },
  { label: "Compare Price", key: "compareAtPrice" },
  { label: "Discount (%)", key: "discountPercentage" },
  { label: "Quantity", key: "quantity" },
  { label: "Status", key: "status" },
  {
    label: "Tags",
    key: "tags",
    render: (rowData) => rowData.tags?.join(", "),
  },
];


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
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const openExportMenu = Boolean(anchorEl);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEdit = () => setEdit(false);

  const pageSize = 4;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
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
      prod.hsnCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    if (filteredProducts) {
      setTotalPages(Math.ceil(filteredProducts.length / pageSize));
    }
  }, [filteredProducts]);
   const paginatedProducts = filteredProducts?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
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

        {/* <Box > */}
        <TableContainer
          component={Paper}
          sx={{
            width: { xs: "30%", sm: "65%", md: "55%", lg: "100%" },
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 1000 }}>
            <TableHead sx={{ backgroundColor: "lightgrey" }}>
              <TableRow>
                <TableCell>
                  <strong>HSN Code</strong>
                </TableCell>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Short Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Price (₹)</strong>
                </TableCell>
                <TableCell>
                  <strong>Compare Price (₹)</strong>
                </TableCell>
                <TableCell>
                  <strong>Discount (%)</strong>
                </TableCell>
                <TableCell>
                  <strong>Quantity</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell>
                  <strong>Tags</strong>
                </TableCell>
                <TableCell width={80}>
                  <strong>Actions</strong>
                </TableCell>
                <TableCell>
                  <strong>Barcode</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedProducts?.map((prod) => (
                <TableRow key={prod._id}>
                  <TableCell>{prod.hsnCode}</TableCell>
                  <TableCell>{prod.name}</TableCell>
                  <TableCell>{prod.shortDescription}</TableCell>
                  <TableCell>{prod.price}</TableCell>
                  <TableCell>{prod.compareAtPrice}</TableCell>
                  <TableCell>{prod.discountPercentage}%</TableCell>
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
        {/* </Box> */}
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

      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      <BarcodePrinter product={code} />
    </>
  );
};

export default ProductList;
