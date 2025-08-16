import {
  Alert,
  Autocomplete,
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
import { useAuth } from "../../context/AuthContext";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import RemoveCircleOutlineOutlinedIcon from '@mui/icons-material/RemoveCircleOutlineOutlined';
import { getUserById } from "../../services/UserService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  minWidth: 700,
  maxHeight: "90vh",
  overflowY: "auto",
};

const AddProduct = ({ open, handleClose, refresh }) => {
  const { webuser } = useAuth();
  const [mainUser, setMainUser] = useState();
  const [form, setForm] = useState({
    name: "",
    shortDescription: "",
    price: "",
    compareAtPrice: "",
    hsnCode: "",
    sku: "",
    quantity: "",
    category: "",
    tags: "",
    unit:"",
    // description: "",
    // weight: "",
    // dimensions: {
    //   length: "",
    //   width: "",
    //   height: "",
    // },
  });
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [categories, setCategories] = useState([]);
  const [hasVariant, setHasVariant] = useState("No");
  const [variants, setVariants] = useState([{ name: "", values: [""] }]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const result = await getUserById(webuser.id)
        setMainUser(result)
        const res = await getAllCategories();
        const parentsOnly = res.data.filter((cat) => cat.parent === null && cat?.organization_id === result.organization_id?._id);
        
        setCategories(parentsOnly);
      } catch (err) {
        console.error("Error loading categories", err);
      }
    };

    fetchCategories();
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
   
  };

  const handleCancel = () => {
    handleClose();
    setForm({
      name: "",
      // description: "",
      shortDescription: "",
      price: "",
      compareAtPrice: "",
      hsnCode: "",
      sku: "",
      quantity: "",
      category: "",
      tags: "",
      unit:"",
      // weight: "",
      // dimensions: {
      //   length: "",
      //   width: "",
      //   height: "",
      // },
    });
  };

  const handleSave = async () => {
    if (!form.name || !form.price || !form.hsnCode) {
      setSnackbarMessage("Enter Required fields!");
      setSnackbarOpen(true);
      return;
    }
    // if (form.hsnCode.length < 6 || form.hsnCode.length > 8) {
    //   setSnackbarMessage("HSN code must be 6 to 8 digits!");
    //   setSnackbarOpen(true);
    //   return;
    // }

    const product = {
      ...form,
      category: form.category ? form.category : (form.category = ""),
      price: parseFloat(form.price),
      compareAtPrice: parseFloat(form.compareAtPrice),
      quantity: parseInt(form.quantity),
      // weight: parseFloat(form.weight),
      tags: form.tags.split(",").map((tag) => tag.trim()),
      hasVariant: hasVariant,
      variantOptions: hasVariant === "Yes" ? variants : [],
      createdBy: webuser.id,
      organization_id: mainUser.organization_id?._id,
    };
    try {           
      const res = await addProducts(product);
      
      if (res) {
        setSnackbarMessage("Product Added!");
        setSnackbarOpen(true);
        refresh();
        handleCancel();
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
                label="HSN Number"
                name="hsnCode"
                value={form.hsnCode}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                sx={{ width: "200px" }}
                label="Price (₹)"
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
                label="MRP(₹)"
                name="compareAtPrice"
                type="number"
                value={form.compareAtPrice}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                sx={{ width: "200px" }}
                label="SKU"
                name="sku"
                value={form.sku}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                sx={{ width: "200px" }}
                label="Short Description"
                name="shortDescription"
                value={form.shortDescription}
                onChange={handleChange}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <TextField
                sx={{ width: "200px" }}
                multiline
                //   minRows={3}
                label="Description"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Grid> */}
            

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
                label="Unit"
                name="unit"
                value={form.unit}
                onChange={handleChange}
              />
            </Grid>
            {/* <Grid item xs={6}>
              <TextField
                sx={{ width: "200px" }}
                label="Weight (kg)"
                name="weight"
                type="number"
                value={form.weight}
                onChange={handleChange}
              />
            </Grid> */}

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
            {/* <Grid item xs={4}>
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
            </Grid> */}
            <Grid item xs={12}>
              <Autocomplete
                options={["Yes", "No"]}
                value={hasVariant}
                onChange={(e, newValue) => setHasVariant(newValue)}
                renderInput={(params) => (
                  <TextField {...params} label="Has Variant" />
                )}
                sx={{ width: "200px" }}
              />
            </Grid>
            {hasVariant === "Yes" && (
              <>
                {variants.map((variant, idx) => (
                  <Grid container spacing={2} key={idx}>
                    <Grid item xs={4}>
                      <TextField
                        label="Variant Name"
                        value={variant.name}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].name = e.target.value;
                          setVariants(updated);
                        }}
                        sx={{ width: "200px" }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Values (comma separated)"
                        value={variant.values.join(",")}
                        onChange={(e) => {
                          const updated = [...variants];
                          updated[idx].values = e.target.value
                            .split(",")
                            .map((v) => v.trim());
                          setVariants(updated);
                        }}
                        sx={{ width: "300px" }}
                      />
                    </Grid>
                    <Grid item xs={2} mt={1}>
                      <Button 
                        onClick={() => {
                          const updated = [...variants];
                          updated.splice(idx, 1);
                          setVariants(updated);
                        }}
                        color="error"
                        variant="outlined"
                      >
                       <RemoveCircleOutlineOutlinedIcon/>
                      </Button>
                    </Grid>
                  </Grid>
                ))}
                <Box mt={1}>
                  <Button
                    onClick={() =>
                      setVariants([...variants, { name: "", values: [""] }])
                    }
                    variant="outlined"
                    color="#2F4F4F"
                  >
                    <AddCircleOutlineOutlinedIcon/>
                  </Button>
                </Box>
              </>
            )}
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
