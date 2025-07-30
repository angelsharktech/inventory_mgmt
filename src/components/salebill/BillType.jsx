//Step 3
import React from 'react';
import { 
  Box, 
  Grid, 
  TextField, 
  MenuItem, 
  RadioGroup, 
  Radio, 
  FormControlLabel, 
  FormControl, 
  Typography, 
  Divider 
} from '@mui/material';

const BillType = ({
  billType,
  setBillType,
  gstPercent,
  setGstPercent,
  customer,
  handlePincodeChange,
  state,
  totals
}) => {
  return (
    <Box mt={3}>
      <Typography variant="h6">Bill Type</Typography>
      <Divider />
      <FormControl>
        <RadioGroup
          row
          value={billType}
          onChange={(e) => setBillType(e.target.value)}
        >
          <FormControlLabel value="gst" control={<Radio />} label="GST" />
          <FormControlLabel
            value="non-gst"
            control={<Radio />}
            label="Non-GST"
          />
        </RadioGroup>
      </FormControl>
      <Grid>
        {billType === "gst" && (
          <TextField
            label="Enter Pincode "
            fullWidth
            sx={{ mt: 2, maxWidth: 300 }}
            value={customer?.pincode || ""}
            onChange={handlePincodeChange}
          />
        )}
      </Grid>
      {billType === "gst" && state?.toLowerCase() === "maharashtra" && (
        <Box mt={4}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={4}>
              <TextField
                select
                label="Select GST %"
                sx={{ width: "200px" }}
                value={gstPercent}
                onChange={(e) => setGstPercent(e.target.value)}
              >
                {[3, 5, 9, 16, 18].map((rate) => (
                  <MenuItem key={rate} value={rate}>
                    {rate}%
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="CGST %"
                fullWidth
                value={(totals?.cgst || 0).toFixed(2)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>

            <Grid item xs={12} sm={4}>
              <TextField
                label="SGST %"
                fullWidth
                value={(totals?.sgst || 0).toFixed(2)}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </Box>
      )}
      {state &&
        state.toLowerCase() !== "maharashtra" &&
        billType === "gst" && (
          <Box mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  select
                  label="Select IGST %"
                  sx={{ width: "200px" }}
                  value={gstPercent}
                  onChange={(e) => setGstPercent(e.target.value)}
                >
                  {[3, 5, 9, 16, 18].map((rate) => (
                    <MenuItem key={rate} value={rate}>
                      {rate}%
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        )}

      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Subtotal"
              fullWidth
              value={(totals?.subtotal || 0).toFixed(2)}
              InputProps={{
                  readOnly: true,
                }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="GST Total"
              fullWidth
              value={(totals?.gstTotal || 0).toFixed(2)}
              InputProps={{
                  readOnly: true,
                }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Grand Total"
              fullWidth
              value={(totals?.grandTotal || 0).toFixed(2)}
              InputProps={{
                  readOnly: true,
                }}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default BillType;