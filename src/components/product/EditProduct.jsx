import {
  Alert,
  Box,
  Button,
  Grid,
  MenuItem,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getAllCategories } from "../../services/CategoryService";
import {
  getProductById,
  updateProductById,
} from "../../services/ProductService";

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

const EditProduct = ({ open, data, handleCloseEdit, refresh }) => {
  const [categories, setCategories] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    sku: "",
    shortDescription: "",
    description: "",
    price: "",
    compareAtPrice: "",
    quantity: "",
    weight: "",
    category: "",
    tags: "",
    dimensions: {
      length: "",
      width: "",
      height: "",
    },
  });

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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getProductById(data?._id);
        const prod = res.data;

        setForm({
          ...prod,
          category: prod.category?._id,
          tags: prod.tags?.join(", ") || "",
          dimensions: {
            length: prod.dimensions?.length || "",
            width: prod.dimensions?.width || "",
            height: prod.dimensions?.height || "",
          },
        });
      } catch (err) {
        console.error("Error loading product by ID", err);
      }
    };

    if (data?._id) {
      fetchProduct();
    }
  }, [data]);

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
  const updateProduct = async () => {
    try {
      const updatedData = {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()),
        dimensions: {
          length: parseFloat(form.dimensions.length),
          width: parseFloat(form.dimensions.width),
          height: parseFloat(form.dimensions.height),
        },
      };

      const res = await updateProductById(data._id, updatedData);
      if (res) {
        setSnackbarMessage("Product Updated!");
        setSnackbarOpen(true);
        refresh(); // Refresh product list if function provided
        handleCloseEdit(); // Close modal
      }
    } catch (err) {
      console.error("Failed to update product:", err);
      setSnackbarMessage("Failed to update product! PLease Logout and Login Again!! ");
        setSnackbarOpen(true);
    }
  };
  return (
    <>
      <Modal open={open} onClose={handleCloseEdit}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Edit Product
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
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
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
            <Button onClick={handleCloseEdit} sx={{ mr: 2 }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
              onClick={updateProduct}
            >
              Update
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
          severity={
            snackbarMessage === "Product Updated!" ? "success" : "error"
          }
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default EditProduct;
