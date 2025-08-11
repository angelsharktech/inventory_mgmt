import React from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Divider,
  MenuItem,
  Autocomplete,
} from "@mui/material";

const VendorDetails = ({
  vendor,
  isExistingVendor,
  handleVendorSelection,
  setVendor,
  supplierList = [],
}) => {
  return (
    <Box mt={3}>
      <Typography variant="h6">Supplier Details</Typography>
      <Divider />
      <Grid container spacing={2} mt={4}>
        {/* Supplier Name Dropdown */}

        <Grid item xs={12} sm={4}>
          <Autocomplete
            options={supplierList}
            getOptionLabel={(option) => option.first_name || ""}
            value={
              supplierList.find((s) => s.first_name === vendor.first_name) ||
              null
            }
            onChange={(event, newValue) => {
              if (newValue) {
                handleVendorSelection(newValue.first_name, "name");
              }
            }}
            ListboxProps={{
              style: {
                maxHeight: 300, // set dropdown height
                overflowY: "auto", // make it scrollable
              },
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Supplier Name"
                sx={{ width: "200px" }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Mobile Number"
            fullWidth
            value={vendor.phone_number}
            onChange={(e) => handleVendorSelection(e.target.value, "phone")}
          />
        </Grid>

        <Grid item xs={12} sm={4}>
          <TextField
            label="Address"
            fullWidth
            value={vendor.address}
            onChange={(e) => setVendor({ ...vendor, address: e.target.value })}
            disabled={isExistingVendor}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default VendorDetails;
