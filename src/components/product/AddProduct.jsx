import {
    Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { addProducts } from "../../services/ProductService";
import { getAllCategories } from "../../services/CategoryService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  minWidth: 800,
  maxHeight: "90vh",
  overflowY: "auto",
};

const AddProduct = ({ open, handleClose, refresh }) => {
  const [form, setForm] = useState({
    name: "",
    description: "",
    shortDescription: "",
    price: "",
    compareAtPrice: "",
    sku: "",
    quantity: "",
    category: "",
    tags: "",
    weight: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [categories, setCategories] = useState([]);
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
    if (["length", "width", "height"].includes(name)) {
      setForm((prev) => ({
        ...prev,
        dimensions: {
          ...prev.dimensions,
          [name]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleCancel = () => {
    handleClose();
    setForm({
      name: "",
      description: "",
      shortDescription: "",
      price: "",
      compareAtPrice: "",
      sku: "",
      quantity: "",
      category: "",
      tags: "",
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
    });
  };

  const handleSave = async () => {
    const product = {
      ...form,
      price: parseFloat(form.price),
      compareAtPrice: parseFloat(form.compareAtPrice),
      quantity: parseInt(form.quantity),
      weight: parseFloat(form.weight),
      tags: form.tags.split(",").map((tag) => tag.trim()),
    };

    try {
      const res = await addProducts(product);
      if (res) {
        setSnackbarMessage("Product Added!");
        setSnackbarOpen(true);
        refresh();
        handleClose();
      }
    } catch (error) {
      console.error("Error adding product", error);
    }
  };

  return (
    <>
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Typography variant="h6" mb={2}>
          Add Product
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              sx={{ width: "200px" }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              sx={{ width: "200px" }}
              label="SKU"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ width: "200px" }}
              label="Short Description"
              name="shortDescription"
              value={form.shortDescription}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              sx={{ width: "200px" }}
              multiline
              //   minRows={3}
              label="Description"
              name="description"
              value={form.description}
              onChange={handleChange}
              required
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              sx={{ width: "200px" }}
              label="Price ($)"
              name="price"
              type="number"
              value={form.price}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              sx={{ width: "200px" }}
              label="Compare at Price ($)"
              name="compareAtPrice"
              type="number"
              value={form.compareAtPrice}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              sx={{ width: "200px" }}
              label="Quantity"
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              sx={{ width: "200px" }}
              label="Weight (kg)"
              name="weight"
              type="number"
              value={form.weight}
              onChange={handleChange}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ width: "200px" }}
              select
              label="Category"
              name="category"
              value={form.category}
              onChange={handleChange}
              //   margin="normal"
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12}>
            <TextField
              sx={{ width: "200px" }}
              label="Tags (comma separated)"
              name="tags"
              value={form.tags}
              onChange={handleChange}
            />
          </Grid>

          {/* Dimensions */}
          <Grid item xs={4}>
            <TextField
              sx={{ width: "200px" }}
              label="Length (cm)"
              name="length"
              type="number"
              value={form.dimensions.length}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              sx={{ width: "200px" }}
              label="Width (cm)"
              name="width"
              type="number"
              value={form.dimensions.width}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              sx={{ width: "200px" }}
              label="Height (cm)"
              name="height"
              type="number"
              value={form.dimensions.height}
              onChange={handleChange}
            />
          </Grid>
        </Grid>

        <Box mt={4} display="flex" justifyContent="flex-end">
          <Button onClick={handleCancel} sx={{ mr: 2, color: "#2F4F4F" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
            onClick={handleSave}
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
              severity={snackbarMessage === "Product Added!" ? "success" : "error"}
              onClose={() => setSnackbarOpen(false)}
              variant="filled"
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
    </>
  );
};

export default AddProduct;
