import React from "react";
import {
  Box,
  Divider,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const GenerateBill = React.forwardRef(({ bill , billName}, ref) => {
  // console.log(bill);
  const {
    org,
    biller,
    products,
    billType,
    paymentType,
    paymentDetails,
    gstPercent,
    totals,
  } = bill;

  return (
    <Box sx={{ p: 4, bgcolor: "#f4f6f8", minHeight: "100vh" }}>
      <Paper ref={ref} elevation={3} sx={{ maxWidth: 800, mx: "auto", p: 4 }}>
        {/* Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              background: "linear-gradient(to right, #0072FF, #00c6ff)",
              color: "#fff",
              px: 2,
              py: 1,
              borderRadius: "4px",
            }}
          >
            {billType.toUpperCase()} - {billName} INVOICE
          </Typography>
          <Box textAlign="right">
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#00c6ff" }}
            >
              {org}
            </Typography>
            {/* <Typography variant="caption">Tagline Space Here</Typography> */}
          </Box>
        </Box>

        {/* Invoice Info */}
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography fontWeight="bold">Invoice to:</Typography>
              <Typography>{biller?.first_name}</Typography>
              <Typography>{biller?.address}</Typography>
              <Typography>{biller?.phone_number}</Typography>
            </Grid>
            <Grid item xs={6} textAlign="right">
              {/* <Typography>
                <strong>Invoice#:</strong> 52148
              </Typography> */}
              <Typography>
                <strong>Date: {new Date().toLocaleDateString()}</strong>
              </Typography>
            </Grid>
          </Grid>
        </Box>

        {/* Product Table */}
        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table size="small" aria-label="invoice table">
            <TableHead sx={{ backgroundColor: "#f0f0f0" }}>
              <TableRow>
                <TableCell>
                  <strong>SL.</strong>
                </TableCell>
                <TableCell>
                  <strong>Item Description</strong>
                </TableCell>
                <TableCell>
                  <strong>Price</strong>
                </TableCell>
                <TableCell>
                  <strong>Qty</strong>
                </TableCell>
                <TableCell>
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {item.productName} - {item.hsnCode}
                  </TableCell>
                  <TableCell>₹{item.price.toFixed(2)}</TableCell>
                  <TableCell>{item.qty}</TableCell>
                  <TableCell>
                    ₹{(item.qty * item.price - item.discount).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid item xs={6} textAlign="right">
          <Typography>
            <b>Sub Total: ₹{totals?.subtotal.toFixed(2)}</b>
          </Typography>

          {billType === "gst" && (
            <>
              <Typography>
                <b>CGST:{`${totals?.cgst}%`}</b>
              </Typography>
              <Typography>
                <b>SGST: {`${totals?.sgst}%`}</b>
              </Typography>
            </>
          )}

          <Typography variant="h6" fontWeight="bold" mt={1}>
            Total: ₹{totals?.grandTotal.toFixed(2)}
          </Typography>
        </Grid>

        {/* Summary Section */}
        <Box mt={3}>
          <Divider />
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <Typography variant="body2" fontWeight="bold">
                Payment Info:
              </Typography>
              <Typography variant="body2">
                Payment Type : {paymentType}
              </Typography>
              {paymentType === "advance" && (
                <>
                  <Typography variant="body2">
                    Advance Paid : {paymentDetails.advance}
                  </Typography>
                  <Typography variant="body2">
                    Advance Pay Mode : {paymentDetails.mode1}
                  </Typography>
                  {paymentDetails.mode1 === "upi" ? (
                    <>
                      <Typography variant="body2">
                        Transaction Number : {paymentDetails.transactionNumber}
                      </Typography>
                    </>
                  ) : (
                    <></>
                  )}
                  <Typography>Balance : {paymentDetails.balance}</Typography>
                </>
              )}
              {paymentDetails.mode1 === "card" ? (
                <>
                  <Typography variant="body2">
                    Card Number : {paymentDetails.cardNumber}
                  </Typography>
                </>
              ) : (
                <></>
              )}
              {paymentDetails.mode1 === "cheque" ? (
                <>
                  <Typography variant="body2">
                    Cheque Number : {paymentDetails.chequeNumber}
                  </Typography>
                </>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Terms */}
        <Box mt={3}>
          <Typography fontWeight="bold" gutterBottom>
            Thank you for your business
          </Typography>
        </Box>

        {/* Signature */}
        <Box display="flex" justifyContent="flex-end" mt={4}>
          <Typography
            variant="body1"
            sx={{
              borderTop: "1px solid #000",
              width: 200,
              textAlign: "center",
              pt: 1,
            }}
          >
            Authorised Sign
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
});

export default GenerateBill;
