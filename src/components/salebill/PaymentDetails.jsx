// step 2
import React from "react";
import {
  Grid,
  TextField,
  MenuItem,
  RadioGroup,
  Radio,
  FormControlLabel,
  FormControl,
  Typography,
  Divider,
  Box,
} from "@mui/material";

const PaymentDetails = ({
  paymentType,
  setPaymentType,
  paymentDetails,
  setPaymentDetails,
  totals,
  notes,
  setNotes,
}) => {
  return (
    <>
      <Box mt={3}>
        <Typography variant="h6">Payment Type</Typography>
        <Divider />
        <FormControl>
          <RadioGroup
            row
            value={paymentType}
            onChange={(e) => setPaymentType(e.target.value)}
          >
            <FormControlLabel
              value="full"
              control={<Radio />}
              label="Full"
            />
            <FormControlLabel
              value="advance"
              control={<Radio />}
              label="Advance"
            />
          </RadioGroup>
        </FormControl>
      </Box>

      {/* Payment Details Form */}
      <Box mt={2}>
        {paymentType === "advance" ? (
          <Grid container spacing={2}>
            {/* Row 1 - Advance */}
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Advance Paid"
                    type="number"
                    fullWidth
                    value={paymentDetails.advance}
                    onChange={(e) => {
                      const adv = e.target.value;
                      const balance = Math.max(
                        totals.grandTotal - adv,
                        0
                      );
                      setPaymentDetails({
                        ...paymentDetails,
                        advance: adv,
                        balance,
                      });
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    sx={{ width: "200px" }}
                    label="Advance Pay Mode"
                    value={paymentDetails.mode1}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        mode1: e.target.value,
                      })
                    }
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                  </TextField>
                </Grid>

                {paymentDetails.mode1 === "upi" && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="UPI Transaction No."
                      fullWidth
                      value={paymentDetails.transactionNumber || ""}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          transactionNumber: e.target.value,
                        })
                      }
                    />
                  </Grid>
                )}
                {paymentDetails.mode1 === "card" && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Card No."
                      fullWidth
                      value={paymentDetails.cardNumber || ""}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cardNumber: e.target.value,
                        })
                      }
                    />
                  </Grid>
                )}
                {paymentDetails.mode1 === "cheque" && (
                  <>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Bank Name"
                        fullWidth
                        value={paymentDetails.bankName || ""}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            bankName: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Cheque Number"
                        fullWidth
                        value={paymentDetails.chequeNumber || ""}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            chequeNumber: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </>
                )}
              </Grid>
            </Grid>

            {/* Row 2 - Balance */}
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="flex-start">
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Balance"
                    type="number"
                    fullWidth
                    value={paymentDetails.balance}
                    disabled
                  />
                </Grid>

                <Grid item xs={12} sm={3}>
                  <TextField
                    select
                    sx={{ width: "200px" }}
                    label="Balance Pay Mode"
                    value={paymentDetails.mode2}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        mode2: e.target.value,
                      })
                    }
                  >
                    <MenuItem value=""></MenuItem>
                    <MenuItem value="cash">Cash</MenuItem>
                    <MenuItem value="upi">UPI</MenuItem>
                    <MenuItem value="card">Card</MenuItem>
                    <MenuItem value="cheque">Cheque</MenuItem>
                  </TextField>
                </Grid>

                {paymentDetails.mode2 === "upi" && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="UPI Transaction No."
                      fullWidth
                      value={paymentDetails.transactionNumber2 || ""}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          transactionNumber2: e.target.value,
                        })
                      }
                    />
                  </Grid>
                )}
                {paymentDetails.mode2 === "card" && (
                  <Grid item xs={12} sm={3}>
                    <TextField
                      label="Card No."
                      fullWidth
                      value={paymentDetails.cardNumber2 || ""}
                      onChange={(e) =>
                        setPaymentDetails({
                          ...paymentDetails,
                          cardNumber2: e.target.value,
                        })
                      }
                    />
                  </Grid>
                )}
                {paymentDetails.mode2 === "cheque" && (
                  <>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Bank Name"
                        fullWidth
                        value={paymentDetails.bankName2 || ""}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            bankName2: e.target.value,
                          })
                        }
                      />
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <TextField
                        label="Cheque Number"
                        fullWidth
                        value={paymentDetails.chequeNumber2 || ""}
                        onChange={(e) =>
                          setPaymentDetails({
                            ...paymentDetails,
                            chequeNumber2: e.target.value,
                          })
                        }
                      />
                    </Grid>
                  </>
                )}
                <TextField
                  label="End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={paymentDetails.dueDate}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      dueDate: e.target.value,
                    })
                  }
                />
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                label="Full Paid"
                type="number"
                fullWidth
                value={totals.grandTotal}
                disabled
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                sx={{ width: "200px" }}
                select
                value={paymentDetails.fullMode}
                onChange={(e) =>
                  setPaymentDetails({
                    ...paymentDetails,
                    fullMode: e.target.value,
                    fullPaid: totals.grandTotal,
                  })
                }
                label="Pay Mode"
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="cash">Cash</MenuItem>
                <MenuItem value="upi">UPI</MenuItem>
                <MenuItem value="card">Card</MenuItem>
                <MenuItem value="cheque">Cheque</MenuItem>
              </TextField>
            </Grid>
            {paymentDetails.fullMode === "upi" && (
              <Grid item xs={12} sm={3}>
                <TextField
                  label="UPI Transaction No."
                  fullWidth
                  value={paymentDetails.transactionNumber || ""}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      transactionNumber: e.target.value,
                    })
                  }
                />
              </Grid>
            )}
            {paymentDetails.fullMode === "card" && (
              <Grid item xs={12} sm={3}>
                <TextField
                  label="Card No."
                  fullWidth
                  value={paymentDetails.cardNumber || ""}
                  onChange={(e) =>
                    setPaymentDetails({
                      ...paymentDetails,
                      cardNumber: e.target.value,
                    })
                  }
                />
              </Grid>
            )}

            {paymentDetails.fullMode === "cheque" && (
              <>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Bank Name"
                    fullWidth
                    value={paymentDetails.bankName || ""}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        bankName: e.target.value,
                      })
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    label="Cheque Number"
                    fullWidth
                    value={paymentDetails.chequeNumber || ""}
                    onChange={(e) =>
                      setPaymentDetails({
                        ...paymentDetails,
                        chequeNumber: e.target.value,
                      })
                    }
                  />
                </Grid>
              </>
            )}
          </Grid>
        )}
        <Box mt={2}>
          <Grid container spacing={2}>
            <TextField
              label="Notes"
              name="notes"
              sx={{ width: "440px" }}
              multiline
              minRows={4}
              onChange={(e) => setNotes(e.target.value)}
            />
          </Grid>
        </Box>
      </Box>
    </>
  );
};

export default PaymentDetails;