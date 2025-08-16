import React, { useRef } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  Button,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const ProductDetails = ({
  products,
  selectedProducts,
  handleProductChange,
  handleAddProduct,
  handleRemoveProduct,
  categories,  // 16.08.25
}) => {
  // Keep refs for each product name dropdown
  const productRefs = useRef([]);

  const handleAddAndFocus = () => {
    handleAddProduct();
    setTimeout(() => {
      const lastIndex = selectedProducts.length; // after push
      if (productRefs.current[lastIndex]) {
        productRefs.current[lastIndex].focus(); // Focus the new dropdown
      }
    }, 10);
  };
  return (
    <Box mt={3}>
      <Typography variant="h6">Products</Typography>
      <Divider />
      {selectedProducts.map((item, index) => (
        <Grid container spacing={2} key={index} mt={4}>
          <Grid item xs={12} sm={2}> {/* Category Dropdown 16.08.25 */}
            <TextField
              select
              label="Category"
              sx={{ width: "150px" }}
              value={item.category}
              onChange={(e) =>
                handleProductChange(index, "category", e.target.value)
              }
            >
              {categories.map((cat) => (
                <MenuItem key={cat._id} value={cat._id}>
                  {cat.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              sx={{ width: "200px" }}
              value={item.productName}
              onChange={(e) =>
                handleProductChange(index, "productName", e.target.value)
              }
              label="Select Product"
              inputRef={(el) => (productRefs.current[index] = el)} // ✅ attach ref
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <TextField
              label="HSN"
              value={item.hsnCode}
              onChange={(e) =>
                handleProductChange(index, "hsnCode", e.target.value)
              }
              sx={{ width: "150px" }}
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={1}>
            <TextField
              label="Qty"
              type="number"
              sx={{ width: "80px" }}
              value={item.qty}
              onChange={(e) =>
                handleProductChange(index, "qty", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="MRP"
              type="number"
              sx={{ width: "90px" }}
              value={item.price}
              onChange={(e) =>
                handleProductChange(index, "price", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="discount %"
              type="number"
              sx={{ width: "100px" }}
              value={item.discountPercentage}
              onChange={(e) =>
                handleProductChange(index, "discountPercentage", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Purchase Price"
              type="number"
              sx={{ width: "100px" }}
              value={item.discountedPrice}
              onChange={(e) =>
                handleProductChange(index, "discountedPrice", e.target.value)
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Total"
              type="number"
              sx={{ width: "100px" }}
              value={item.discountedPrice * item.qty}
            />
          </Grid>
          <Grid item xs={12} sm={1}>
            <IconButton onClick={() => handleRemoveProduct(index)}>
              <Delete color="error" />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Button
        onClick={handleAddAndFocus}
        variant="contained"
        sx={{ mt: 2, backgroundColor: "#2F4F4F" }}
      >
        + Add Product
      </Button>
    </Box>
  );
};

export default ProductDetails;
