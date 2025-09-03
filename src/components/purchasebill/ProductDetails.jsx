// components/ProductDetails.jsx
import React, { useMemo, useRef, useEffect } from "react";
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

const ProductDetails = ({
  products, // optional
  selectedProducts,
  handleProductChange,
  handleAddProduct,
  handleRemoveProduct,
  categories = [],
  billType,
  isWithinState,
  gstPercent,
  onTotalsChange,
  onError
}) => {
  console.log("ProductDetails render:", { selectedProducts });

  const productRefs = useRef([]);

  const handleAddAndFocus = () => {
    handleAddProduct();
    setTimeout(() => {
      const lastIndex = selectedProducts.length; // index after push
      if (productRefs.current[lastIndex]) {
        productRefs.current[lastIndex].focus();
      }
    }, 10);
  };

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

  const calculateGSTForProduct = (product) => {
    if (billType !== "gst") return 0;
    const price = sanitizeNumber(product.discountedPrice ?? product.price);
    const qty = sanitizeNumber(product.qty);
    const amount = price * qty;

    const percentFromProduct = sanitizeNumber(product.gstPercent ?? product.gst);
    const parentPercent = sanitizeNumber(gstPercent);
    const rate = percentFromProduct || parentPercent || 0;

    const gstAmount = amount * (rate / 100);
    return +gstAmount.toFixed(2);
  };

  const calculateTotalWithGST = (product) => {
    const price = sanitizeNumber(product.discountedPrice ?? product.price);
    const qty = sanitizeNumber(product.qty);
    const amount = price * qty;
    if (billType !== "gst") return +amount.toFixed(2);
    const gstAmount = calculateGSTForProduct(product);
    return +(amount + gstAmount).toFixed(2);
  };

  return (
    <Box mt={3}>
      <Typography variant="h6">Products</Typography>
      <Divider />
      {selectedProducts.map((item, index) => {
        if (
          item.compareAtPrice &&
          parseFloat(item.compareAtPrice) < parseFloat(item.discountedPrice ?? item.price)
        ) {
          if (onError) {
            onError("MRP should be greater than Selling Price!");
          }
          return null; // prevent further GST calculations for this invalid row
        }

        const gstAmount = calculateGSTForProduct(item);
        const gstRate = sanitizeNumber(item.gstPercent ?? item.gst ?? gstPercent);
        const cgstPerRow = isWithinState ? +(gstAmount / 2).toFixed(2) : 0;
        const sgstPerRow = isWithinState ? +(gstAmount / 2).toFixed(2) : 0;
        const igstPerRow = !isWithinState ? +gstAmount.toFixed(2) : 0;

        return (
          <Grid container spacing={2} key={index} mt={4} alignItems="center">

            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                value={item.productName || ""}
                onChange={(e) => handleProductChange(index, "productName", e.target.value)}
                label="Select Product"
                inputRef={(el) => (productRefs.current[index] = el)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                select
                label="Category"
                sx={{ width: '200px' }}
                value={item.category._id || item.category || ''}
                // value={item.category || ""} 
                onChange={(e) => handleProductChange(index, "category", e.target.value)}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={1}>
              <TextField
                label="HSN"
                fullWidth
                value={item.hsnCode || ""}
                onChange={(e) => handleProductChange(index, "hsnCode", e.target.value)}
              />
            </Grid>
            {billType === "gst" && (
              <Grid item xs={12} sm={1}>
                <TextField
                  label="GST %"
                  type="number"
                  fullWidth
                  value={item.gstPercent ?? ""}
                  onChange={(e) => handleProductChange(index, "gstPercent", e.target.value)}
                />
              </Grid>
            )}

            <Grid item xs={12} sm={1}>
              <TextField
                label="Qty"
                type="number"
                fullWidth
                value={item.qty ?? ""}
                onChange={(e) => handleProductChange(index, "qty", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={1}>
              <TextField
                label="Price"
                type="number"
                fullWidth
                value={item.discountedPrice ?? ""}
                onChange={(e) => handleProductChange(index, "discountedPrice", e.target.value)}
              />
            </Grid>

            {billType === "gst" && (
              <>
                {isWithinState ? (
                  <>
                    <Grid item xs={12} sm={1}>
                      <TextField
                        label={`CGST (${gstRate / 2 || 0}%)`}
                        type="number"
                        fullWidth
                        value={cgstPerRow}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={1}>
                      <TextField
                        label={`SGST (${gstRate / 2 || 0}%)`}
                        type="number"
                        fullWidth
                        value={sgstPerRow}
                        InputProps={{ readOnly: true }}
                      />
                    </Grid>
                  </>
                ) : (
                  <Grid item xs={12} sm={2}>
                    <TextField
                      label={`IGST (${gstRate || 0}%)`}
                      type="number"
                      fullWidth
                      value={igstPerRow}
                      InputProps={{ readOnly: true }}
                    />
                  </Grid>
                )}
              </>
            )}

            <Grid item xs={12} sm={1}>
              <TextField
                label="Total"
                type="number"
                fullWidth
                value={calculateTotalWithGST(item)}
                InputProps={{ readOnly: true }}
              />
            </Grid>
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
        sx={{
          background: "linear-gradient(135deg, #182848, #324b84ff)",
          color: "#fff",
          minWidth: "150px",
          mt: 2,
        }}
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

