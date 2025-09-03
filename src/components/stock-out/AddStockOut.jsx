import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  MenuItem,
  Box,
  Typography,
  IconButton
} from "@mui/material";
import { Close } from "@mui/icons-material";

const AddStockOut = ({ open, handleClose, handleAddStock }) => {
  const [formData, setFormData] = useState({
    date: '',
    invoiceNo: '',
    receiverName: '',
    category: '',
    productName: '',
    quantity: '',
    description: ''
  });

  const categories = [
    'Electronics',
    'Clothing',
    'Home & Kitchen',
    'Books',
    'Fitness',
    'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    // Basic validation
    if (!formData.date || !formData.invoiceNo || !formData.receiverName || 
        !formData.category || !formData.productName || !formData.quantity) {
      alert("Please fill in all required fields");
      return;
    }

    handleAddStock(formData);
    // Reset form
    setFormData({
      date: '',
      invoiceNo: '',
      receiverName: '',
      category: '',
      productName: '',
      quantity: '',
      description: ''
    });
  };

  const handleCancel = () => {
    // Reset form on cancel
    setFormData({
      date: '',
      invoiceNo: '',
      receiverName: '',
      category: '',
      productName: '',
      quantity: '',
      description: ''
    });
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Add Stock Out</Typography>
          <IconButton onClick={handleCancel} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              InputLabelProps={{
                shrink: true,
              }}
              required
            />
          </Grid>
          {/* <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Invoice Number"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleChange}
              required
            />
          </Grid> */}
          <Grid item xs={12} sm={6} width={200}>
            <TextField
              fullWidth
              label="Receiver Name"
              name="receiverName"
              value={formData.receiverName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6} width={200}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="#182848">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{background: "linear-gradient(135deg, #182848, #324b84ff)", 
                color: "#fff",}}>
          Add Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockOut;