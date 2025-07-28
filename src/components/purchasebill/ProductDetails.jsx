import React from 'react';
import { 
  Box, 
  Grid, 
  TextField, 
  MenuItem, 
  IconButton, 
  Typography, 
  Divider, 
  Button 
} from '@mui/material';
import { Delete } from '@mui/icons-material';

const ProductDetails = ({
  products,
  selectedProducts,
  handleProductChange,
  handleAddProduct,
  handleRemoveProduct
}) => {
  return (
    <Box mt={3}>
      <Typography variant="h6">Products</Typography>
      <Divider />
      {selectedProducts.map((item, index) => (
        <Grid container spacing={2} key={index} mt={4}>
          <Grid item xs={12} sm={3}>
            <TextField
              sx={{ width: "200px" }}
              select
              value={item.productName}
              onChange={(e) =>
                handleProductChange(index, "productName", e.target.value)
              }
              label="Select Product"
            >
              {products.data?.map((prod) => (
                <MenuItem key={prod._id} value={prod.name}>
                  {prod.name}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={1}>
            <TextField
              select
              label="HSN"
              value={item.hsnCode}
              onChange={(e) =>
                handleProductChange(index, "hsnCode", e.target.value)
              }
              sx={{ width: "150px" }}
            >
              {[
                ...new Set(products.data?.map((prod) => prod.hsnCode)),
              ].map((hsn) => (
                <MenuItem key={hsn} value={hsn}>
                  {hsn}
                </MenuItem>
              ))}
            </TextField>
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
              label="Unit Price"
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
                handleProductChange(
                  index,
                  "discountPercentage",
                  e.target.value
                )
              }
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <TextField
              label="Selling Price"
              type="number"
              sx={{ width: "100px" }}
              value={item.discountedPrice }
              onChange={(e) =>
                handleProductChange(
                  index,
                  "discountedPrice",
                  e.target.value
                )
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
        onClick={handleAddProduct}
        variant="contained"
        sx={{ mt: 2, backgroundColor: "#2F4F4F" }}
      >
        + Add Product
      </Button>
    </Box>
  );
};

export default ProductDetails;