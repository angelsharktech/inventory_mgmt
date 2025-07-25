import React from 'react';
import { Box, Grid, TextField, Typography, Divider } from '@mui/material';

const CustomerDetails = ({ 
  customer, 
  isExistingCustomer, 
  handleMobile, 
  setCustomer 
}) => {
  return (
    <Box mt={3}>
      <Typography variant="h6">Customer Details</Typography>
      <Divider />
      <Grid container spacing={2} mt={4}>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Mobile Number"
            fullWidth
            value={customer.phone_number}
            onChange={(e) => handleMobile(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Customer Name"
            fullWidth
            value={customer.first_name}
            onChange={(e) =>
              setCustomer({ ...customer, first_name: e.target.value })
            }
            disabled={isExistingCustomer}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            label="Address"
            fullWidth
            value={customer.address}
            onChange={(e) =>
              setCustomer({ ...customer, address: e.target.value })
            }
            disabled={isExistingCustomer}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDetails;