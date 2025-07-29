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
  Stack,
  Button,
  Snackbar,
  Alert,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  deleteCategory,
  getAllCategories,
  getCategoryTree,
} from "../../services/CategoryService";
import AddCategory from "./AddCategory";
import EditCategory from "./EditCategory";
import PaginationComponent from "../shared/PaginationComponent";
import FilterData from "../shared/FilterData";

const CategoryList = () => {
  const [rows, setRows] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [edit, setEdit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEdit = () => setEdit(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res.success) {
        const flattened = [];

        res.data
          .filter((cat) => cat.parent) 
          .forEach((cat) => {
            flattened.push({
              id: cat._id,
              name: cat.name,
              slug: cat.slug,
              description: cat.description,
              parent:
                typeof cat.parent === "object"
                  ? { _id: cat.parent._id, name: cat.parent.name }
                  : null,
            });
          });

        setRows(flattened);
      }
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };
const filteredCategory = rows?.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.parent.name?.toLowerCase().includes(searchQuery.toLowerCase()) 
  );
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  // --------------end of search
  useEffect(() => {
    if (filteredCategory) {
      setTotalPages(Math.ceil(filteredCategory.length / pageSize));
    }
  }, [filteredCategory]);
  const paginatedCategory = filteredCategory?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const handleEdit = (rowData) => {
    setData(rowData);
    setEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        const res = await deleteCategory(id);
        if (res) {
          setSnackbarMessage("Category Deleted!");
          setSnackbarOpen(true);
          fetchCategories(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting category", error);
        alert("Failed to delete category.");
      }
    }
  };
  return (
    <>
      <Box p={3}>
         <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" fontWeight={600}>
            Categories
          </Typography>
          <FilterData value={searchQuery} onChange={handleSearchChange} />
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
            onClick={handleOpen}
          >
            Add Category
          </Button>
        </Box>

        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead sx={{ backgroundColor: "lightgrey" }}>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Parent category</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCategory?.map((row, index) => (
                <TableRow key={index}>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>
                    {row.parent && typeof row.parent === "object"
                      ? row.parent.name
                      : "-"}
                  </TableCell>

                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleEdit(row)}>
                      <EditIcon />
                    </IconButton>
                     <IconButton
                      color="error"
                      onClick={() => handleDelete(row.id)}
                    >
                      <DeleteIcon />
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
            snackbarMessage === "Category Deleted!" ? "success" : "error"
          }
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AddCategory
        open={open}
        handleClose={handleClose}
        refresh={fetchCategories}
      />
      <EditCategory
        edit={edit}
        data={data}
        handleCloseEdit={handleCloseEdit}
        refresh={fetchCategories}
      />
      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default CategoryList;
