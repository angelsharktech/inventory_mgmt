import {
  Box,
  Button,
  Modal,
  TextField,
  Typography,
  MenuItem,
  Snackbar,
  Alert,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import {
  addCategories,
  getAllCategories,
} from "../../services/CategoryService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  minWidth: 350,
};

const AddCategory = ({ open, handleClose ,refresh }) => {
  const [categories, setCategories] = useState([]);
  const [main, setMain] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    parent: "",
    mainName: "",
    mainDescription: "",
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategories();
        const parentsOnly = res.data.filter((cat) => cat.parent === null);
        setCategories(parentsOnly);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleToggleMain = () => {
    setMain((prevMain) => {
      const nextMain = !prevMain;

      setFormData((prev) => ({
        ...prev,
        // Reset the other type of form data
        ...(nextMain
          ? { name: "", description: "", parent: "" } // Clear subcategory fields
          : { mainName: "", mainDescription: "" }), // Clear main category fields
      }));

      return nextMain;
    });
  };

  const handleCancel = () => {
    handleClose();
    setMain(false);
    setFormData({
      name: "",
      description: "",
      parent: "",
      mainName: "",
      mainDescription: "",
    });
  };

  const categoryAdd = async () => {
    try {
      let payload;

      if (main) {
        payload = {
          name: formData.mainName,
          description: formData.mainDescription,
        };
      } else {
        payload = {
          name: formData.name,
          description: formData.description,
          parent: formData.parent,
        };
      }
      const res = await addCategories(payload);
      
      if (res) {
        setSnackbarMessage("Category Added!");
        setSnackbarOpen(true);
        refresh();
        handleClose();
      }
    } catch (error) {
    //   console.error("Error adding category", error);
      setSnackbarMessage("Category Already Exist!");
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" mb={2}>
              Add Category
            </Typography>
            <Button
              variant={main ? "outlined" : "contained"}
              sx={{
                color: main ? "#2F4F4F" : "#fff",
                backgroundColor: main ? "transparent" : "#2F4F4F",
              }}
              onClick={() => handleToggleMain()}
            >
              {main ? "Add Sub Category" : "Add Main Category"}
            </Button>
          </Box>

          {main ? (
            <>
              <TextField
                fullWidth
                label="Main Category Name"
                name="mainName"
                value={formData.mainName}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Main Description"
                name="mainDescription"
                value={formData.mainDescription}
                onChange={handleChange}
                margin="normal"
              />
            </>
          ) : (
            <>
              <TextField
                fullWidth
                select
                label="Parent Category"
                name="parent"
                value={formData.parent}
                onChange={handleChange}
                margin="normal"
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                fullWidth
                label="Category Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                margin="normal"
              />
            </>
          )}

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleCancel} sx={{ mr: 2, color: "#2F4F4F" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
              onClick={categoryAdd}
            >
              Save
            </Button>
          </Box>
        </Box>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarMessage === "Category Added!" ? "success" : "error"}
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default AddCategory;
