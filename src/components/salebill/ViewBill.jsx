import {
  Box,
  Button,
  Divider,
  Grid,
  IconButton,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { getSaleBillById } from "../../services/SaleBillService";
import CloseIcon from "@mui/icons-material/Close";
import GenerateBill from "../shared/GenerateBill";
import moment from "moment";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  minWidth: 600,
  maxHeight: "90vh",
};

const ViewBill = ({ open, data, handleCloseView }) => {
  const [bill, setBill] = useState();
  const [printData, setPrintData] = useState();
  const [showPrint, setShowPrint] = useState(false);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await getSaleBillById(data);
        setBill(res.data);
      } catch (err) {
        console.error("Error loading bill by ID", err);
      }
    };

    if (data) {
      fetchBill();
    } else {
      console.log("No valid ID found in data prop");
    }
  }, [data]);
  console.log("view bill::", bill);
  const handlePrint = () => {
    try {
      console.log("print bill::", bill);

      setPrintData(bill);
      setShowPrint(true); // Show bill for printing
      setTimeout(() => {
        window.print();
        setShowPrint(false); // Optional
      }, 500);
    } catch (error) {}
  };

  if (!open) return null;
  return (
    <>
      <Modal open={open} onClose={handleCloseView}>
        <Box sx={style}>
          <IconButton
            aria-label="close"
            onClick={handleCloseView}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <Box display="flex" justifyContent="space-between">
            <Typography variant="h6" fontWeight="bold">
              Invoice Type: {bill?.billType}
            </Typography>
            <Typography variant="h6" fontSize={16} mt={6}>
              Invoice Number: {bill?.bill_number} <br />
              Date: {moment(bill?.createdAt).format("DD/MM/YYYY")}
            </Typography>
          </Box>
          {/* Invoice Info */}
          <Box mt={3}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Typography variant="h6" fontWeight="bold">
                  Invoice to:
                </Typography>
                <Typography>{bill?.bill_to?.first_name}</Typography>
                <Typography>{bill?.bill_to?.address}</Typography>
                <Typography>{bill?.bill_to?.phone_number}</Typography>
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
                    Unit Price
                  </TableCell>
                  <TableCell
                    sx={{ border: "1px solid #ccc", fontWeight: "bold" }}
                  >
                    Discount
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
                    Total
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bill?.products?.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      {index + 1}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      {item.name} - {item.hsnCode}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      ₹{item.unitPrice}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      {item.discount}
                    </TableCell>
                    <TableCell sx={{ border: "1px solid #ccc" }}>
                      ₹{item.price}
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

          <Grid item xs={6} textAlign="right" mt={2}>
            <Typography>
              <b>Sub Total: ₹{bill?.subtotal.toFixed(2)}</b>
            </Typography>

            {bill?.billType === "gst" && (
              <>
                <Typography>
                  <b>CGST:{`${bill?.cgst}%`}</b>
                </Typography>
                <Typography>
                  <b>SGST: {`${bill?.sgst}%`}</b>
                </Typography>
              </>
            )}

            <Typography variant="h6" fontWeight="bold" mt={1}>
              Total: ₹{bill?.grandTotal.toFixed(2)}
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
                  Payment Type : {bill?.paymentType}
                </Typography>
                {bill?.paymentType === "advance" && (
                  <>
                    <Typography variant="body2">
                      Advance Paid : {bill?.advance}
                    </Typography>
                    {/* <Typography variant="body2">
                    Advance Pay Mode : {bill.paymentDetails.mode1}
                  </Typography>
                  {bill.paymentDetails.mode1 === "upi" && (
                    <Typography variant="body2">
                      Transaction Number :{" "}
                      {bill.paymentDetails.transactionNumber}
                    </Typography>
                  )} */}
                    <Typography>Balance : {bill?.balance}</Typography>
                  </>
                )}
                {/* {bill.paymentDetails.mode1 === "card" && (
                <Typography variant="body2">
                  Card Number : {bill.paymentDetails.cardNumber}
                </Typography>
              )}
              {bill.paymentDetails.mode1 === "cheque" && (
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
              )} */}
              </Grid>
            </Grid>
          </Box>
          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handlePrint}>
              Print
            </Button>
          </Box>
        </Box>
      </Modal>

      {showPrint && printData && (
        <div className="print-only">
          <GenerateBill bill={printData} billName={"SALE"} />
        </div>
      )}
    </>
  );
};

export default ViewBill;
