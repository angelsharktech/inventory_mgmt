import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  TextField,
  MenuItem,
  Button,
  Typography
} from "@mui/material";

const AddStockIn = ({ open, handleClose, handleAddStock }) => {
  const [formData, setFormData] = useState({
    date: '',
    invoiceNo: '',
    category: '',
    productName: '',
    quantity: '',
    description: ''
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = () => {
    handleAddStock(formData);
    setFormData({
      date: '',
      invoiceNo: '',
      category: '',
      productName: '',
      quantity: '',
      description: ''
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Add New Stock</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleFormChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Invoice Number"
              name="invoiceNo"
              value={formData.invoiceNo}
              onChange={handleFormChange}
              placeholder="e.g., INV-001"
            />
          </Grid>
          <Grid item xs={12} sm={6} width={200}>
            <TextField
              fullWidth
              select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleFormChange}
            >
              <MenuItem value="Electronics">Electronics</MenuItem>
              <MenuItem value="Clothing">Clothing</MenuItem>
              <MenuItem value="Home & Kitchen">Home & Kitchen</MenuItem>
              <MenuItem value="Books">Books</MenuItem>
              <MenuItem value="Fitness">Fitness</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Product Name"
              name="productName"
              value={formData.productName}
              onChange={handleFormChange}
              placeholder="Enter product name"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Quantity"
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleFormChange}
              placeholder="Enter quantity"
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
              onChange={handleFormChange}
              placeholder="Enter product description"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={!formData.date || !formData.invoiceNo || !formData.productName}
        >
          Add Stock
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddStockIn;