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

  // ✅ Unified handling
  const isGST = bill.billType?.toLowerCase() === "gst";
  const customer = bill.biller || bill.bill_to;
  const orgName = typeof bill.org === "string" ? bill.org : bill.org?.name;
  const payment = bill.paymentDetails || bill;
  const totals = bill.totals || {
    subtotal: bill.subtotal,
    gstTotal: bill.gstTotal,
    cgst: bill.cgst,
    sgst: bill.sgst,
    igst: bill.igst,
    grandTotal: bill.grandTotal,
  };

  return (
    // <Box sx={{ p: 4, minHeight: "100vh" }}>
      <Paper
        ref={ref}
        className="print-only"
        // elevation={3}
        sx={{ maxWidth: 800, mx: "auto", p: 4 ,mt: 2}}
      >
        {/* Header */}
        <Box>
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
            {isGST ? "INVOICE" : "PERFORMA INVOICE"}
          </Typography>

          {/* Org Name */}
          <Box textAlign="right" sx={{ mb: 2 }}>
            <Typography
              variant="h6"
              fontWeight="bold"
              sx={{ color: "#00c6ff" }}
            >
              {orgName}
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
              <Typography>{customer?.first_name}</Typography>
              <Typography>{customer?.address}</Typography>
              <Typography>{customer?.phone_number}</Typography>
            </Grid>
          </Grid>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Products Table */}
        <Typography variant="h6" fontWeight="bold">
          Products:
        </Typography>
        <TableContainer sx={{ mt: 2, border: "1px solid #ccc" }}>
          <Table size="small" aria-label="invoice table">
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f0f0f0" }}>
                {[
                  "SL.",
                  "Item Description",
                  "MRP",
                  "Discount ",
                  "Price",
                  "Qty",
                  "Total",
                ].map((label) => (
                  <TableCell
                    key={label}
                    sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                  >
                    {label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {bill.products.map((item, index) => (
                <TableRow key={index}>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {index + 1}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {item.name || item.productName} - {item.hsnCode}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {item.unitPrice}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {item.discount || item.discountPercentage}%
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    ₹{item.price.toFixed(2)}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    {item.qty}
                  </TableCell>
                  <TableCell sx={{ border: "1px solid #ccc" }}>
                    ₹{(item.price * item.qty).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Totals */}
        <Grid item xs={6} textAlign="right" mt={2}>
          <Typography>
            <b>Sub Total: ₹{totals.subtotal?.toFixed(2)}</b>
          </Typography>

          {isGST && (
            <>
              <Typography>
                <b>CGST: {totals.cgst}%</b>
              </Typography>
              <Typography>
                <b>SGST: {totals.sgst}%</b>
              </Typography>
            </>
          )}

          <Typography variant="h6" fontWeight="bold" mt={1}>
            Total: ₹{totals.grandTotal?.toFixed(2)}
          </Typography>
        </Grid>

        {/* Payment Info */}
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

              {/* Advance Payment */}
              {bill.paymentType === "advance" && (
                <>
                  <Typography variant="body2">
                    Advance Paid : {payment.advance}
                  </Typography>
                  <Typography variant="body2">
                    Advance Pay Mode : {payment.advpaymode}
                  </Typography>
                  {payment.advpaymode === "upi" && (
                    <Typography variant="body2">
                      Transaction Number : {payment.transactionNumber}
                    </Typography>
                  )}
                  {payment.advpaymode === "card" && (
                    <Typography variant="body2">
                      Card Number : {payment.cardLastFour}
                    </Typography>
                  )}
                  {payment.advpaymode === "cheque" && (
                    <Typography variant="body2">
                      Cheque Number : {payment.chequeNumber}
                    </Typography>
                  )}
                  <Typography>Balance : {payment.balance}</Typography>
                </>
              )}

              {/* Full Payment */}
              {bill.paymentType === "full" && (
                <>
                  <Typography variant="body2">
                    Payment Mode : {payment.fullMode}
                  </Typography>
                  {payment.fullMode === "upi" && (
                    <Typography variant="body2">
                      Transaction Number : {payment.transactionNumber}
                    </Typography>
                  )}
                  {payment.fullMode === "card" && (
                    <Typography variant="body2">
                      Card Number : {payment.cardLastFour}
                    </Typography>
                  )}
                  {payment.fullMode === "cheque" && (
                    <Typography variant="body2">
                      Cheque Number : {payment.chequeNumber}
                    </Typography>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </Box>

        {/* Footer */}
        <Box mt={3}>
          <Typography fontWeight="bold" gutterBottom>
            Thank you for your business
          </Typography>
        </Box>

        {/* Signature */}
        <Box display="flex" justifyContent="center" mt={4}>
          <Grid item ml={4} marginRight={"40px"}>
            <b style={{ fontSize: "12px" }}>
              This is system generated receipt, no signature required.
            </b>
          </Grid>
        </Box>
      </Paper>
    // </Box>
  );
});

export default GenerateBill;
