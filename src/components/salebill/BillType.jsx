import React from "react";
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
  Divider,
} from "@mui/material";

const BillType = ({
  billType,
  setBillType,
  isWithinState,
  setIsWithinState,
}) => {
  return (
    <Box p={2} border="1px solid #ddd" borderRadius="8px">
      <Typography variant="h6" gutterBottom>
        Bill Details
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {/* Bill Type Dropdown */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={6}>
          <TextField
            select
            fullWidth
            label="Bill Type"
            value={billType || ""}
            onChange={(e) => setBillType(e.target.value)}
          >
            <MenuItem value="gst">GST Bill</MenuItem>
            <MenuItem value="nongst">Non-GST Bill</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      {/* Within State / Out of State */}
      {billType === "gst" && (
        <Box mt={3}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Billing Location</Typography>
            <RadioGroup
              row
              value={isWithinState ? "within" : "out"}   // <-- now string for UI
              onChange={(e) => setIsWithinState(e.target.value === "within")}
            >
              <FormControlLabel value="within" control={<Radio />} label="Within State" />
              <FormControlLabel value="out" control={<Radio />} label="Out of State" />
            </RadioGroup>
          </FormControl>
        </Box>
      )}
    </Box>
  );
};

export default BillType;
