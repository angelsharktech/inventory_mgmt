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

const CategoryList = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [data, setData] = useState();
  const [edit, setEdit] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEdit = () => setEdit(false);

  useEffect(() => {
    fetchCategories();
  }, []);
  // const fetchCategories = async () => {
  //   try {
  //     const res = await getAllCategories();
  //     if (res.success) {
  //       const flattened = [];

  //       res.data.forEach((cat) => {
  //         flattened.push({
  //           id: cat._id,
  //           name: cat.name,
  //           description: cat.description,
  //           parent: cat.parent && typeof cat.parent === "object"
  //             ? { _id: cat.parent._id, name: cat.parent.name }
  //             : null,
  //         });
  //       });

  //       setRows(flattened);
  //     }
  //   } catch (err) {
  //     console.error("Error loading categories", err);
  //   }
  // };

  const fetchCategories = async () => {
    try {
      const res = await getAllCategories();
      if (res.success) {
        const flattened = [];

        res.data
          .filter((cat) => cat.parent) // ✅ Only include categories with a parent
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
        <Typography variant="h5" fontWeight={600} mb={2}>
          Categories
        </Typography>

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
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Parent category</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Edit</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Delete</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, index) => (
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
                  </TableCell>
                  <TableCell align="center">
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
    </>
  );
};

export default CategoryList;
