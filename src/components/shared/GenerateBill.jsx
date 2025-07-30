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

const GenerateBill = React.forwardRef(({ bill, billName }, ref) => {
  console.log('generate bill:',bill);
  
  return (
    <Box sx={{ p: 4, minHeight: "100vh" }}>
      <Paper
        ref={ref}
        className="print-only"
        elevation={3}
        sx={{ maxWidth: 800, mx: "auto", p: 4 }}
      >
        {/* Header */}
        <Box>
          {/* Gradient Invoice Heading (Full Width) */}
          <Typography
            fontWeight="bold"
            variant="h5"
            sx={{
              background: "linear-gradient(to right, #0072FF, #00c6ff)",
              color: "#fff",
              px: 1,
              py: 1,
              borderRadius: "4px",
              width: "100%",
              textAlign: "left",
              mb: 1,
              mr: 2,
            }}
          >
            {bill.billType.toLowerCase() === 'gst' ? (<>INVOICE</>): (<>PERFORMA INVOICE</>)} 
          </Typography>

          {/* Org Name below aligned right */}
          <Box textAlign="right" sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#00c6ff" }}
            >
              {bill.org}
            </Typography>
          </Box>
          <Box textAlign="right" sx={{ mb: 2 }}>
            <Typography>
              <strong>Date: {new Date().toLocaleDateString()}</strong>
            </Typography>
          </Box>
        </Box>

        {/* Invoice Info */}
        <Box mt={3}>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Typography variant="h6" fontWeight="bold">
                Invoice to:
              </Typography>
              <Typography>{bill.biller?.first_name}</Typography>
              <Typography>{bill.biller?.address}</Typography>
              <Typography>{bill.biller?.phone_number}</Typography>
            </Grid>
          </Grid>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" fontWeight="bold">
          Products:
        </Typography>
        {/* Product Table */}
        <TableContainer sx={{ mt: 2, border: "1px solid #ccc" }}>
          <Table
            size="small"
            aria-label="invoice table"
            sx={{ borderCollapse: "collapse" }}
          >
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                <TableCell
                  sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                >
                  SL.
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                >
                  Item Description
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                >
                  Price
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                >
                  Qty
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                >
                  Discount
                </TableCell>
                <TableCell
                  sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                >
                  Total
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bill.products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {item.productName} - {item.hsnCode}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    ₹{item.price.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {item.qty}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {item.discountPercentage}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    ₹{(item.discountedPrice * item.qty).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Grid item xs={6} textAlign="right" mt={2}>
          <Typography>
            <b>Sub Total: ₹{bill.totals?.subtotal.toFixed(2)}</b>
          </Typography>

          {bill.billType === "gst" && (
            <>
              <Typography>
                <b>CGST:{`${bill.totals?.cgst}%`}</b>
              </Typography>
              <Typography>
                <b>SGST: {`${bill.totals?.sgst}%`}</b>
              </Typography>
            </>
          )}

          <Typography variant="h6" fontWeight="bold" mt={1}>
            Total: ₹{bill.totals?.grandTotal.toFixed(2)}
          </Typography>
        </Grid>

        {/* Summary Section */}
        <Box mt={3}>
          <Divider />
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <Typography variant="h6" fontWeight="bold">
                Payment Info:
              </Typography>
              <Typography variant="body2">
                Payment Type : {bill.paymentType}
              </Typography>
              {bill.paymentType === "advance" && (
                <>
                  <Typography variant="body2">
                    Advance Paid : {bill.paymentDetails.advance}
                  </Typography>
                  <Typography variant="body2">
                    Advance Pay Mode : {bill.paymentDetails.advpaymode}
                  </Typography>
                  {bill.paymentDetails.advpaymode === "upi" && (
                    <Typography variant="body2">
                      Transaction Number :{" "}
                      {bill.paymentDetails.transactionNumber}
                    </Typography>
                  )}
                  <Typography>
                    Balance : {bill.paymentDetails.balance}
                  </Typography>
                </>
              )}
              {bill.paymentDetails.advpaymode === "card" && (
                <Typography variant="body2">
                  Card Number : {bill.paymentDetails.cardNumber}
                </Typography>
              )}
              {bill.paymentDetails.advpaymode === "cheque" && (
                <Typography variant="body2">
                  Cheque Number : {bill.paymentDetails.chequeNumber}
                </Typography>
              )}
              {bill.paymentType === "full" && (
                <>
                  <Typography variant="body2">
                    Payment Mode : {bill.paymentDetails.fullMode}
                  </Typography>
                  </>
              )}
              {bill.paymentDetails.fullMode === "upi" && (
                    <Typography variant="body2">
                      Transaction Number :{" "}
                      {bill.paymentDetails.transactionNumber}
                    </Typography>
                  )}
                   {bill.paymentDetails.fullMode === "card" && (
                <Typography variant="body2">
                  Card Number : {bill.paymentDetails.cardNumber}
                </Typography>
              )}
              {bill.paymentDetails.fullMode === "cheque" && (
                <Typography variant="body2">
                  Cheque Number : {bill.paymentDetails.chequeNumber}
                </Typography>
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
        <Box display="flex" justifyContent="center" mt={4}>
          <Grid item ml={4} marginRight={"40px"}>
            <b style={{ fontSize: "12px" }}>
              This is system generated receipt no signature required
            </b>
            <br />
          </Grid>
        </Box>
      </Paper>
    </Box>
  );
});

export default GenerateBill;
