import React, { useEffect, useState } from "react";
import {
  Box,
  IconButton,
  Modal,
  TextField,
  Grid,
  Typography,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import moment from "moment";
import { addPayment, updatePayment } from "../../services/PaymentModeService";
import {
  getSaleBillById,
  updateSaleBill,
} from "../../services/SaleBillService";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  boxShadow: 24,
  borderRadius: 2,
  p: 3,
  minWidth: 800,
  maxHeight: "90vh",
  overflowY: "auto",
};

const EditBill = ({ open, data, handleCloseEdit, refresh }) => {
  const [bill, setBill] = useState(null);
  const [advance, setAdvance] = useState(0);
  const [balance, setBalance] = useState(0);
  const [fullPay, setFullPay] = useState(0);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await getSaleBillById(data?._id);
        const billData = res.data;
        setBill(billData);
        setAdvance(Number(billData.advance || 0));
        const calculatedBalance =
          Number(billData.grandTotal || 0) -
          Number(billData.fullPaid || 0) -
          Number(billData.advance || 0);
        setBalance(calculatedBalance);
      } catch (err) {
        console.error("Error loading bill by ID", err);
      }
    };

    if (data?._id) {
      fetchBill();
    }
  }, [data]);
  useEffect(() => {
    const fullPayment = balance === 0 ? bill?.grandTotal : 0;
    setFullPay(fullPayment);
  }, [advance, balance]);

  const handleAdvanceChange = async (e) => {
    const newAdvance = parseFloat(e.target.value || "0");
    setAdvance(newAdvance);

    const newBalance =
      (bill?.grandTotal || 0) - (bill?.fullPaid || 0) - newAdvance;
    setBalance(newBalance);
  };

  const updateBill = async () => {
    try {
      const updatedData = {
        advance: advance,
        balance: balance,
        paymentType: balance > 0 ? "advance" : "full",
        fullpaid: fullPay,
      };

      const res = await updateSaleBill(bill._id, updatedData);
      refresh();
      handleCloseEdit();
      if (bill.advancePayments || bill.fullPayment) {
        const isAdvance = !!bill.advancePayments;
        const mode = isAdvance
          ? paymentDetails.advpaymode
          : paymentDetails.fullMode;
        const amount = isAdvance
          ? paymentDetails.advance
          : paymentDetails.fullPaid;

        let paymentPayload = {
          paymentType: mode,
          amount: amount,
          client_id: data.bill_to?._id,
          work_id: data._id,
          organization: data.org?._id,
        };

        const modeLower = (mode || "").toLowerCase();

        if (modeLower === "upi") {
          paymentPayload.referenceId = paymentDetails.transactionNumber;
        } else if (modeLower === "cheque") {
          paymentPayload.bankName = paymentDetails.bankName;
          paymentPayload.chequeNumber = paymentDetails.chequeNumber;
        } else {
          paymentPayload.description = `${
            isAdvance ? "Advance" : "Full"
          } payment for Bill`;
        }

        try {
          const paymentResult = await addPayment( paymentPayload);
          if (paymentResult.success) {
            console.log("Payment updated successfully");
          }
        } catch (error) {
          console.error("Failed to update payment:", error);
        }
      }
    } catch (error) {}
  };
  return (
    <Modal open={open} onClose={handleCloseEdit}>
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleCloseEdit}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" gutterBottom>
          Purchase Bill Details
        </Typography>

        {bill && (
          <Grid container spacing={2} mt={1}>
            <Grid item xs={6}>
              <TextField
                label="Bill Number"
                value={bill.bill_number || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Bill Date"
                value={moment(bill.createdAt).format("YYYY-MM-DD")}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Customer Name"
                value={bill.bill_to?.first_name || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Phone Number"
                value={bill.bill_to?.phone_number || ""}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Payment Type"
                value={bill.paymentType}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Bill Type"
                value={bill.billType}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Sub Total"
                value={bill.subtotal?.toFixed(2)}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="GST Total"
                value={bill.gstTotal?.toFixed(2)}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Grand Total"
                value={bill.grandTotal?.toFixed(2)}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Advance"
                type="number"
                value={advance}
                onChange={handleAdvanceChange}
                fullWidth
                disabled={Number(bill.advance) === 0}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                label="Full Paid"
                value={fullPay?.toFixed(2)}
                fullWidth
                disabled
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Balance"
                value={balance.toFixed(2)}
                fullWidth
                disabled
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={bill.notes || ""}
                fullWidth
                multiline
                rows={3}
                disabled
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                variant="contained"
                sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
                onClick={updateBill}
              >
                Update
              </Button>
            </Grid>
          </Grid>
        )}
      </Box>
    </Modal>
  );
};

export default EditBill;
