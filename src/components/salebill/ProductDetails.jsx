import React, { useEffect, useRef, useState } from "react";
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
import { getProductByBarcode } from "../../services/ProductService";

const ProductDetails = ({
  products,
  selectedProducts,
  handleProductChange,
  handleAddProduct,
  handleRemoveProduct,
  productErrors,
  setSelectedProducts, // <-- Needed to update list after scan
}) => {
  const [scannedCode, setScannedCode] = useState("");
  const inputRef = useRef();

  // Always keep scanner input ready
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Handle barcode scan
  const handleScan = async (e) => {
    if (e.key === "Enter") {
      const code = scannedCode.trim();
      if (!code) return;

      try {
        console.log("Scanning code:", code);

        const product = await getProductByBarcode(code);
        console.log("Scanned product:", product);

        if (product) {
          setSelectedProducts((prev) => {
            const existingIndex = prev.findIndex(
              (p) => p._id === product.data._id
            );
            if (existingIndex > -1) {
              // If product already exists, increment qty
              const updated = [...prev];
              updated[existingIndex].qty =
                Number(updated[existingIndex].qty) + 1;
              return updated;
            } else {
              return [
                ...prev,
                {
                  productName: product.data.name,
                  hsnCode: product.data.hsnCode,
                  qty: 1,
                  price: product.data.price,
                  discountPercentage: product.data.discountPercentage || 0,
                  discountedPrice: product.data.price, // You can calculate based on discount
                  _id: product.data._id,
                },
              ];
            }
          });
        } else {
          console.log("No product found for code:", code);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
      }

      setScannedCode("");
    }
  };

  return (
    <Box mt={3}>
      <Typography variant="h6">Products</Typography>
      <Divider />
      {/* Hidden scanner input */}
      <TextField
        inputRef={inputRef}
        value={scannedCode}
        onChange={(e) => setScannedCode(e.target.value)}
        onKeyDown={handleScan}
        label="Scan Barcode"
        variant="outlined"
        size="small"
        sx={{ position: "absolute", left: "-9999px" }} // hide from UI
      />

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
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 300, // set dropdown height
                      overflowY: "auto", // make it scrollable
                    },
                  },
                },
              }}
            >
              {products?.map((prod) => (
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
              SelectProps={{
                MenuProps: {
                  PaperProps: {
                    style: {
                      maxHeight: 300, // set dropdown height
                      overflowY: "auto", // make it scrollable
                    },
                  },
                },
              }}
            >
              {[...new Set(products?.map((prod) => prod.hsnCode))].map(
                (hsn) => (
                  <MenuItem key={hsn} value={hsn}>
                    {hsn}
                  </MenuItem>
                )
              )}
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
              error={!!productErrors?.[index]}
              helperText={productErrors?.[index] || ""}
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
              label="Selling Price"
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
        onClick={handleAddProduct}
        variant="contained"
        sx={{ mt: 2, backgroundColor: "#2F4F4F" }}
      >
        + Add Product
      </Button>
      {/* //barcode scanner button */}
      {/* <Button
        onClick={() => inputRef.current.focus()}
        variant="outlined"
        sx={{ mt: 2, ml: 2 }}
      >
        Enable Scanner
      </Button> */}
    </Box>
  );
};

export default ProductDetails;
