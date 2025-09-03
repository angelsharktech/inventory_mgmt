// import React, { useState, useEffect, useMemo } from "react";
// import {
//   Box,
//   Grid,
//   TextField,
//   MenuItem,
//   RadioGroup,
//   Radio,
//   FormControlLabel,
//   FormControl,
//   Typography,
//   Divider,
// } from "@mui/material";

// const BillType = ({
//   billType,
//   setBillType,
//   gstPercent,
//   setGstPercent,
//   state,
//   totals, // expect at least: { subtotal }
//   isWithinState, // Receive from parent
//   setIsWithinState, // Receive from parent
// }) => {
//   const computed = useMemo(() => {
//     const subtotal = Number(totals?.subtotal || 0);
//     const rate = billType === "gst" ? Number(gstPercent || 0) : 0;
//     const gstAmount = +(subtotal * (rate / 100)).toFixed(2);

//     if (billType !== "gst") {
//       return {
//         subtotal,
//         cgstPercent: 0,
//         sgstPercent: 0,
//         igstPercent: 0,
//         cgst: 0,
//         sgst: 0,
//         igst: 0,
//         gstTotal: 0,
//         grandTotal: +(subtotal).toFixed(2),
//       };
//     }

//     if (isWithinState) {
//       // split percentage and amount
//       const cgstPercent = +(rate / 2).toFixed(2);
//       const sgstPercent = +(rate / 2).toFixed(2);
//       const cgst = +(subtotal * (cgstPercent / 100)).toFixed(2);
//       // ensure sum equals gstAmount (handle rounding)
//       const sgst = +(gstAmount - cgst).toFixed(2);

//       return {
//         subtotal,
//         cgstPercent,
//         sgstPercent,
//         igstPercent: 0,
//         cgst,
//         sgst,
//         igst: 0,
//         gstTotal: +(cgst + sgst).toFixed(2),
//         grandTotal: +(subtotal + cgst + sgst).toFixed(2),
//       };
//     } else {
//       const igstPercent = +rate.toFixed(2);
//       const igst = gstAmount;

//       return {
//         subtotal,
//         cgstPercent: 0,
//         sgstPercent: 0,
//         igstPercent,
//         cgst: 0,
//         sgst: 0,
//         igst,
//         gstTotal: igst,
//         grandTotal: +(subtotal + igst).toFixed(2),
//       };
//     }
//   }, [totals?.subtotal, gstPercent, billType, isWithinState]);

//   return (
//     <Box mt={3}>
//       <Typography variant="h6">Bill Type</Typography>
//       <Divider sx={{ mb: 2 }} />

//       <FormControl>
//         <RadioGroup
//           row
//           value={billType}
//           onChange={(e) => setBillType(e.target.value)}
//         >
//           <FormControlLabel value="gst" control={<Radio />} label="GST" />
//           <FormControlLabel value="non-gst" control={<Radio />} label="Non-GST" />
//         </RadioGroup>
//       </FormControl>

//       {billType === "gst" && (
//         <Box mt={2}>
//           <Typography variant="subtitle2">Supply Type</Typography>
//           <FormControl>
//             <RadioGroup
//               row
//               value={isWithinState ? "within" : "out"}
//               onChange={(e) => setIsWithinState(e.target.value === "within")}
//             >
//               <FormControlLabel value="within" control={<Radio />} label="Within State" />
//               <FormControlLabel value="out" control={<Radio />} label="Out of State" />
//             </RadioGroup>
//           </FormControl>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default BillType;




import React, { useMemo } from "react";
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
  gstPercent,
  setGstPercent,
  totals, // expect at least: { subtotal }
  isWithinState,
  setIsWithinState,
}) => {
  const computed = useMemo(() => {
    const subtotal = Number(totals?.subtotal || 0);
    const rate = billType === "gst" ? Number(gstPercent || 0) : 0;
    const gstAmount = +(subtotal * (rate / 100)).toFixed(2);

    if (billType !== "gst") {
      return {
        subtotal,
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent: 0,
        cgst: 0,
        sgst: 0,
        igst: 0,
        gstTotal: 0,
        grandTotal: +(subtotal).toFixed(2),
      };
    }

    if (isWithinState) {
      const cgstPercent = +(rate / 2).toFixed(2);
      const sgstPercent = +(rate / 2).toFixed(2);
      const cgst = +(subtotal * (cgstPercent / 100)).toFixed(2);
      const sgst = +(gstAmount - cgst).toFixed(2);

      return {
        subtotal,
        cgstPercent,
        sgstPercent,
        igstPercent: 0,
        cgst,
        sgst,
        igst: 0,
        gstTotal: +(cgst + sgst).toFixed(2),
        grandTotal: +(subtotal + cgst + sgst).toFixed(2),
      };
    } else {
      const igstPercent = +rate.toFixed(2);
      const igst = gstAmount;

      return {
        subtotal,
        cgstPercent: 0,
        sgstPercent: 0,
        igstPercent,
        cgst: 0,
        sgst: 0,
        igst,
        gstTotal: igst,
        grandTotal: +(subtotal + igst).toFixed(2),
      };
    }
  }, [totals?.subtotal, gstPercent, billType, isWithinState]);

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
            label="Bill Type"
            value={billType || ""}
            onChange={(e) => setBillType(e.target.value)}
            sx={{width:'150px'}}
          >
            <MenuItem value="gst">GST Bill</MenuItem>
            <MenuItem value="non-gst">Non-GST Bill</MenuItem>
          </TextField>
        </Grid>

        {/* GST % input (only if GST selected) */}
        {/* {billType === "gst" && (
          <Grid item xs={6}>
            <TextField
              type="number"
              fullWidth
              label="GST %"
              value={gstPercent || ""}
              onChange={(e) => setGstPercent(e.target.value)}
            />
          </Grid>
        )} */}
      </Grid>

      {/* Supply Type (only for GST) */}
      {billType === "gst" && (
        <Box mt={3}>
          <FormControl component="fieldset">
            <Typography variant="subtitle1">Supply Type</Typography>
            <RadioGroup
              row
              value={isWithinState ? "within" : "out"}
              onChange={(e) => setIsWithinState(e.target.value === "within")}
            >
              <FormControlLabel
                value="within"
                control={<Radio />}
                label="Within State"
              />
              <FormControlLabel
                value="out"
                control={<Radio />}
                label="Out of State"
              />
            </RadioGroup>
          </FormControl>
        </Box>
      )}

      {/* Totals Preview */}
      {/* <Box mt={3}>
        <Typography variant="body2">Subtotal: ₹{computed.subtotal}</Typography>
        {billType === "gst" && (
          <>
            {isWithinState ? (
              <>
                <Typography variant="body2">
                  CGST ({computed.cgstPercent}%): ₹{computed.cgst}
                </Typography>
                <Typography variant="body2">
                  SGST ({computed.sgstPercent}%): ₹{computed.sgst}
                </Typography>
              </>
            ) : (
              <Typography variant="body2">
                IGST ({computed.igstPercent}%): ₹{computed.igst}
              </Typography>
            )}
            <Typography variant="body2">
              GST Total: ₹{computed.gstTotal}
            </Typography>
          </>
        )}
        <Typography variant="subtitle1" fontWeight="bold">
          Grand Total: ₹{computed.grandTotal}
        </Typography>
      </Box> */}
    </Box>
  );
};

export default BillType;
