import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  MenuItem,
  IconButton,
  Typography,
  Divider,
  Button,
  Paper,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { getProductByBarcode } from "../../services/ProductService";
import BillType from "./BillType";

const ProductDetails = ({
  products,
  selectedProducts,
  handleProductChange,
  handleAddProduct,
  handleRemoveProduct,
  isWithinState,
  onTotalsChange,
  gstPercent,
  billType// <-- boolean (true = within, false = out)
}) => {

  const inputRef = useRef();
  const productRefs = useRef([]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // robust sanitizer for numbers and percent strings
  const sanitizeNumber = (v) => {
    if (v === null || v === undefined || v === "") return 0;
    if (typeof v === "number") return Number.isFinite(v) ? v : 0;
    // remove commas and percent signs and whitespace
    const cleaned = String(v).replace(/[,%]/g, "").trim();
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  };

  // compute totals memoized
  const totalsMemo = useMemo(() => {
    // debug helper (uncomment during troubleshooting)
    // console.debug("DEBUG totalsMemo:", { selectedProducts, gstPercent, billType, isWithinState });

    const subtotal = selectedProducts.reduce((acc, p) => {
      const price = sanitizeNumber(p.discountedPrice ?? p.price);
      const qty = sanitizeNumber(p.qty);
      return acc + price * qty;
    }, 0);

    if (billType !== "gst") {
      return {
        subtotal: +subtotal.toFixed(2),
        cgst: 0,
        sgst: 0,
        igst: 0,
        gstTotal: 0,
        grandTotal: +subtotal.toFixed(2),
      };
    }

    let totalCGST = 0;
    let totalSGST = 0;
    let totalIGST = 0;

    selectedProducts.forEach((p) => {
      const price = sanitizeNumber(p.discountedPrice ?? p.price);
      const qty = sanitizeNumber(p.qty);
      const amount = price * qty;

      const percentFromProduct = sanitizeNumber(p.gstPercent ?? p.gst);
      const parentPercent = sanitizeNumber(gstPercent);
      const rate = percentFromProduct || parentPercent || 0;

      const gstAmount = amount * (rate / 100);

      if (isWithinState) {
        totalCGST += gstAmount / 2;
        totalSGST += gstAmount / 2;
      } else {
        totalIGST += gstAmount;
      }
    });

    const cgst = +totalCGST.toFixed(2);
    const sgst = +totalSGST.toFixed(2);
    const igst = +totalIGST.toFixed(2);
    const gstTotal = +((cgst + sgst + igst).toFixed(2));
    const grandTotal = +(subtotal + gstTotal).toFixed(2);

    return {
      subtotal: +subtotal.toFixed(2),
      cgst,
      sgst,
      igst,
      gstTotal,
      grandTotal,
    };
  }, [selectedProducts, gstPercent, billType, isWithinState]);
  // notify parent when totals change
  useEffect(() => {
    if (typeof onTotalsChange === "function") {
      onTotalsChange(totalsMemo);
    }
  }, [totalsMemo, onTotalsChange]);



  // ✅ Auto-focus on new product
  const handleAddAndFocus = () => {
    handleAddProduct();
    setTimeout(() => {
      const lastIndex = selectedProducts.length;
      if (productRefs.current[lastIndex]) {
        productRefs.current[lastIndex].focus();
      }
    }, 10);
  };

  // ✅ GST Calculation
  const calculateGST = (item) => {
    const gstRate = Number(item.gstPercent || 0);
    const base = Number(item.discountedPrice || 0) * Number(item.qty || 0);
    const gstAmount = +(base * (gstRate / 100)).toFixed(2);

    if (isWithinState) {
      const half = +(gstAmount / 2).toFixed(2);
      return { cgst: half, sgst: half, igst: 0 };
    } else {
      return { cgst: 0, sgst: 0, igst: gstAmount };
    }
  };

  return (
    <Box mt={3}>
      <Typography variant="h6">Products</Typography>
      <Divider />


      {selectedProducts.map((item, index) => {
        const { cgst, sgst, igst } = calculateGST(item);

        return (
          <Grid container spacing={2} key={index} mt={4}>
            {/* Product Dropdown */}
            <Grid item xs={12} sm={3}>
              <TextField
                sx={{ width: "200px" }}
                select
                value={item.productName}
                onChange={(e) =>
                  handleProductChange(index, "productName", e.target.value)
                }
                label="Select Product"
                inputRef={(el) => (productRefs.current[index] = el)}
              >
                {products?.map((prod) => (
                  <MenuItem key={prod._id} value={prod.name}>
                    {prod.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* HSN */}
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
                {[...new Set(products?.map((prod) => prod.hsnCode))].map(
                  (hsn) => (
                    <MenuItem key={hsn} value={hsn}>
                      {hsn}
                    </MenuItem>
                  )
                )}
              </TextField>
            </Grid>

            {/* Qty */}
            <Grid item xs={12} sm={1}>
              <TextField
                label="Qty"
                type="number"
                sx={{ width: "80px" }}
                value={item.qty}
                onChange={(e) => handleProductChange(index, "qty", e.target.value)}
              />
            </Grid>

            {/* MRP */}
            <Grid item xs={12} sm={2}>
              <TextField
                label="MRP"
                type="number"
                sx={{ width: "90px" }}
                value={item.price}
                onChange={(e) => handleProductChange(index, "price", e.target.value)}
              />
            </Grid>

            {/* Discount % */}
            <Grid item xs={12} sm={2}>
              <TextField
                label="Discount %"
                type="number"
                sx={{ width: "100px" }}
                value={item.discountPercentage}
                onChange={(e) =>
                  handleProductChange(index, "discountPercentage", e.target.value)
                }
              />
            </Grid>

            {/* Selling Price */}
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

            {/* GST % */}
            {/* GST % */}
            {billType === "gst" && (
              <Grid item xs={12} sm={1.5}>
                <TextField
                  label="GST %"
                  type="number"
                  sx={{ width: "80px" }}
                  value={item.gstPercent || ""}   // ✅ bind the value
                  onChange={(e) =>
                    handleProductChange(index, "gstPercent", e.target.value)
                  }
                />
              </Grid>
            )}


            {billType === 'gst' && isWithinState && (
              <>
                <Grid item xs={12} sm={1.5}>
                  <TextField label="CGST" value={cgst} InputProps={{ readOnly: true }} />
                </Grid>
                <Grid item xs={12} sm={1.5}>
                  <TextField label="SGST" value={sgst} InputProps={{ readOnly: true }} />
                </Grid>
              </>
            )}

            {billType === 'gst' && !isWithinState && (
              <Grid item xs={12} sm={2}>
                <TextField label="IGST" value={igst} InputProps={{ readOnly: true }} />
              </Grid>
            )}


            {/* Total */}
            <Grid item xs={12} sm={2}>
              <TextField
                label="Total"
                value={
                  item.discountedPrice * item.qty +
                  (isWithinState ? cgst + sgst : igst)
                }
                InputProps={{ readOnly: true }}
              />
            </Grid>

            {/* Delete Button */}
            <Grid item xs={12} sm={1}>
              <IconButton onClick={() => handleRemoveProduct(index)}>
                <Delete color="error" />
              </IconButton>
            </Grid>
          </Grid>
        );
      })}

      <Button
        onClick={handleAddAndFocus}
        variant="contained"
        sx={{ mt: 2, backgroundColor: "#182848" }}
      >
        + Add Product
      </Button>
      {billType === "gst" && (
        <Paper elevation={2} sx={{ p: 2, mt: 3, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h6" gutterBottom>
            GST Summary
          </Typography>
          <Grid container spacing={2}>
            {isWithinState ? (
              <>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label={`Total CGST`}
                    type="number"
                    fullWidth
                    value={totalsMemo.cgst}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label={`Total SGST`}
                    type="number"
                    fullWidth
                    value={totalsMemo.sgst}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </>
            ) : (
              <Grid item xs={12} sm={4}>
                <TextField
                  label={`Total IGST`}
                  type="number"
                  fullWidth
                  value={totalsMemo.igst}
                  InputProps={{ readOnly: true }}
                />
              </Grid>
            )}
            <Grid item xs={12} sm={4}>
              <TextField
                label="Total GST Amount"
                type="number"
                fullWidth
                value={totalsMemo.gstTotal}
                InputProps={{ readOnly: true }}
                sx={{ fontWeight: "bold" }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="Total Grand Amount"
                type="number"
                fullWidth
                value={totalsMemo.grandTotal}
                InputProps={{ readOnly: true }}
                sx={{ fontWeight: "bold" }}
              />
            </Grid>
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default ProductDetails;
