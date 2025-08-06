import React from 'react';
import { Box, Grid, TextField, Typography, Divider } from '@mui/material';

const VendorDetails = ({ 
  vendor, 
  isExistingVendor, 
  handleMobile, 
  setVendor 
}) => {
  return (
    <Box mt={3}>
      <Typography variant="h6">Supplier Details</Typography>
      <Divider />
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Mobile Number"
            fullWidth
            value={vendor.phone_number}
            onChange={(e) => handleMobile(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Supplier Name"
            fullWidth
            value={vendor.first_name}
            onChange={(e) =>
              setVendor({ ...vendor, first_name: e.target.value })
            }
            disabled={isExistingVendor}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Address"
            fullWidth
            value={vendor.address}
            onChange={(e) =>
              setVendor({ ...vendor, address: e.target.value })
            }
            disabled={isExistingVendor}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDetails;