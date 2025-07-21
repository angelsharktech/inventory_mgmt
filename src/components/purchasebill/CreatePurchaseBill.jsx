import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Radio,
  RadioGroup,
  FormControl,
  FormControlLabel,
  FormLabel,
  Select,
  TextField,
  Typography,
  IconButton,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import { getAllProducts } from "../../services/ProductService";
import {
  getAllUser,
  getUserById,
  registerUser,
} from "../../services/UserService";
import { Delete } from "@mui/icons-material";
import { getAllPositions } from "../../services/Position";
import { getAllRoles } from "../../services/Role";
import { useAuth } from "../../context/AuthContext";
import GenerateBill from "../shared/GenerateBill";

const CreatePurchaseBill = () => {
  const { webuser } = useAuth();
  const [vendor, setVendor] = useState({
    first_name: "",
    address: "",
    gstNumber: "",
    phone_number: "",
    pincode: "",
  });
  const [isExistingVendor, setIsExistingVendor] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    { productName: "", hsnCode: "", qty: 0, price: 0, discount: 0, gst: 0 },
  ]);
  const [billType, setBillType] = useState("non-gst");
  const [gstPercent, setGstPercent] = useState(0);
  const [paymentType, setPaymentType] = useState("full");
  const [paymentDetails, setPaymentDetails] = useState({
    advance: 0,
    balance: 0,
    mode1: "",
    transactionNumber: "",
    bankName: "",
    chequeNumber: "",
    mode2: "",
    transactionNumber2: "",
    bankName2: "",
    chequeNumber2: "",
    cardNumber: "",
    cardNumber2: "",
    fullMode: "",
    fullPaid: 0,
  });
  const [totals, setTotals] = useState(0);
  const [step, setStep] = useState(1);
  const [printData, setPrintData] = useState();
  const [showPrint, setShowPrint] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [state, setState] = useState();
  const [mainUser, setMainUser] = useState();

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posData, roleData, userData, user] = await Promise.all([
          getAllPositions(),
          getAllRoles(),
          getAllUser(),
          getUserById(webuser.id),
        ]);
        setPositions(posData);
        setRoles(roleData);
        setUsers(userData);
        setMainUser(user);
      } catch (err) {
        console.error("Failed to fetch form data:", err);
      }
    };
    fetchAll();
  }, []);

  //   calculating totals
  useEffect(() => {
    let subtotal = 0;
    selectedProducts.forEach((item) => {
      const qty = Number(item.qty);
      const price = Number(item.price);
      const discount = Number(item.discount);
      const taxable = qty * price - discount;
      subtotal += taxable;
    });
    const isMaharashtra = state?.toLowerCase() === "maharashtra";
    const isGST = billType === "gst";

    let gstTotal = 0;
    let cgst = 0;
    let sgst = 0;
    let igst = 0;

    if (isGST) {
      gstTotal = (subtotal * gstPercent) / 100;

      if (isMaharashtra) {
        cgst = gstPercent / 2;
        sgst = gstPercent / 2;
      } else {
        igst = gstTotal;
      }
    }

    const grandTotal = subtotal + gstTotal;

    setTotals({
      subtotal,
      gstTotal,
      cgst,
      sgst,
      igst,
      grandTotal,
    });
  }, [selectedProducts, gstPercent, billType, state]);
  // End of total calculation

  // fetch product data
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };
  // End of product fetch

  //   calculations of advance payment
  useEffect(() => {
    if (paymentType === "advance") {
      paymentDetails.fullMode = "";
      paymentDetails.fullPaid = 0;
      const advance = Number(paymentDetails.advance) || 0;
      const balance = totals.grandTotal - advance;

      setPaymentDetails((prev) => ({
        ...prev,
        balance: balance > 0 ? balance : 0,
      }));
    }
  }, [paymentDetails.advance, paymentType, totals.grandTotal]);
  // End calculations of advance payment

  const handleMobile = async (phone) => {
    
    const phoneExists = users.find((u) => u.phone_number === phone && u.role_id.name.toLowerCase() === 'vendor');

    if (phoneExists) {
      setVendor({
        first_name: phoneExists.first_name,
        address: phoneExists.address,
        phone_number: phone,
      });
      setIsExistingVendor(true);
    } else {
      setVendor({ first_name: "", address: "", phone_number: phone });
      setIsExistingVendor(false);
    }
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];

    if (field === "productName") {
      const product = products.data.find((p) => p._id === value);

      if (product) {
        updated[index] = {
          ...updated[index],
          productName: product.name,
          hsnCode: product.hsnCode || "",
          price: product.price || 0,
        };
      }
    } else if (field === "hsnCode") {
      const product = products.data.find((p) => p.hsnCode === value);

      if (product) {
        updated[index] = {
          ...updated[index],
          productName: product.name,
          hsnCode: product.hsnCode,
          price: product.price || 0,
        };
      }
    } else {
      updated[index][field] = value;
    }

    setSelectedProducts(updated);
  };

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      { productName: "", hsnCode: "", qty: 0, price: 0, discount: 0, gst: 0 },
    ]);
  };
  const handleRemoveProduct = (index) => {
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
  };
  // checking pincode form external api
  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setVendor({ ...vendor, pincode });

    if (pincode.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        const data = await res.json();
        const stateFind = data[0]?.PostOffice?.[0]?.State || "Not Found";
        if (stateFind === "Not Found") {
          setSnackbarOpen(true);
          setSnackbarMessage("State Not Found!");
          return;
        }
        setState(stateFind);
      } catch (error) {
        console.error("Error fetching state from pincode", error);
      }
    }
  };
  // end of checking pincode form external api
  const handleSubmit = async () => {
    try {
      if (!vendor.phone_number || !vendor.first_name) {
        setSnackbarMessage("Please fill vendor details!");
        setSnackbarOpen(true);
        return;
      }

      for (let p of selectedProducts) {
        if (!p.productName || p.qty <= 0 || p.price <= 0) {
          setSnackbarMessage("Please fill all product details correctly!");
          setSnackbarOpen(true);
          return;
        }
      }

      if (!isExistingVendor) {
        const vendorRole = roles.find(
          (role) => role.name.toLowerCase() === "vendor"
        );
        const vendorposition = positions.find(
          (pos) => pos.name.toLowerCase() === "vendor"
        );
        const payload = {
          ...vendor,
          organization_id: mainUser.organization_id?._id,
          email: vendor.first_name + "@example.com",
          password: vendor.first_name + "@example.com",
          role_id: vendorRole._id,
          position_id: vendorposition._id,
        };

        const res = await registerUser(payload);
      }

      const billData = {
        biller: vendor,
        products: selectedProducts,
        billType,
        paymentType,
        paymentDetails,
        gstPercent,
        totals,
        org: mainUser.organization_id?.name,
      };

      // await createPurchaseBill(billData);

      setSnackbarMessage("Purchase bill created successfully!");
      setSnackbarOpen(true);
      setPrintData(billData);
      setShowPrint(true); // Show bill for printing
      setStep(1);
      setVendor({
        first_name: "",
        address: "",
        gstNumber: "",
        phone_number: "",
      });
      setSelectedProducts([
        { productName: "", hsnCode: "", qty: 0, price: 0, discount: 0, gst: 0 },
      ]);
      setPaymentDetails({
        advance: 0,
        balance: 0,
        mode1: "",
        mode2: "",
        fullPaid: 0,
        fullMode: "",
      });
      setTimeout(() => {
        window.print(); // Native print
        setShowPrint(false); // Hide again after printing
      }, 1000);
    } catch (error) {
      setSnackbarMessage("Vendor " + error);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 3,
          bgcolor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <Typography variant="h5" gutterBottom>
          Create Purchase Bill
        </Typography>

        {/* Step 1: Vendor Info */}
        {step === 1 && (
          <Box mt={3}>
            <Typography variant="h6">Vendor Details</Typography>
            <Divider />
            <Grid container spacing={2} mt={4}>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Mobile Number"
                  fullWidth
                  value={vendor.phone_number}
                  onChange={(e) => handleMobile(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Vendor Name"
                  fullWidth
                  value={vendor.first_name}
                  onChange={(e) =>
                    setVendor({ ...vendor, first_name: e.target.value })
                  }
                  disabled={isExistingVendor}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  label="Address"
                  fullWidth
                  value={vendor.address}
                  onChange={(e) =>
                    setVendor({ ...vendor, address: e.target.value })
                  }
                  disabled={isExistingVendor}
                />
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Step 2: Product Details */}
        {step === 2 && (
          <Box mt={3}>
            <Typography variant="h6">Products</Typography>
            <Divider />
            {selectedProducts.map((item, index) => (
              <Grid container spacing={2} key={index} mt={4}>
                <Grid item xs={12} sm={3}>
                  <TextField
                    sx={{ width: "200px" }}
                    select
                    value={item.productName}
                    onChange={(e) =>
                      handleProductChange(index, "productName", e.target.value)
                    }
                    label="Select Product"
                  >
                    {products.data?.map((prod) => (
                      <MenuItem key={prod._id} value={prod._id}>
                        {prod.name}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextField
                    select
                    label="HSN"
                    value={item.hsnCode}
                    onChange={(e) =>
                      handleProductChange(index, "hsnCode", e.target.value)
                    }
                    sx={{ width: "200px" }}
                  >
                    {[
                      ...new Set(products.data?.map((prod) => prod.hsnCode)),
                    ].map((hsn) => (
                      <MenuItem key={hsn} value={hsn}>
                        {hsn}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={1}>
                  <TextField
                    label="Qty"
                    type="number"
                    sx={{ width: "120px" }}
                    value={item.qty}
                    onChange={(e) =>
                      handleProductChange(index, "qty", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={2}>
                  <TextField
                    label="Price"
                    type="number"
                    sx={{ width: "120px" }}
                    value={item.price}
                    onChange={(e) =>
                      handleProductChange(index, "price", e.target.value)
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={1}>
                  <IconButton onClick={() => handleRemoveProduct(index)}>
                    <Delete color="error" />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            <Button
              onClick={handleAddProduct}
              variant="contained"
              sx={{ mt: 2, backgroundColor: "#2F4F4F" }}
            >
              + Add Product
            </Button>
          </Box>
        )}

        {/* Step 3: Bill Type */}
        {step === 3 && (
          <Box mt={3}>
            <Typography variant="h6">Bill Type</Typography>
            <Divider />
            <FormControl>
              {/* <FormLabel>Bill Type</FormLabel> */}
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
                  value={vendor.pincode || ""}
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
                      disabled
                    />
                  </Grid>

                  <Grid item xs={12} sm={4}>
                    <TextField
                      label="SGST %"
                      fullWidth
                      value={(totals?.sgst || 0).toFixed(2)}
                      disabled
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
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="GST Total"
                    fullWidth
                    value={(totals?.gstTotal || 0).toFixed(2)}
                    disabled
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    label="Grand Total"
                    fullWidth
                    value={(totals?.grandTotal || 0).toFixed(2)}
                    disabled
                  />
                </Grid>
              </Grid>
            </Box>
          </Box>
        )}

        {/* Step 4: Payment Type */}
        {step === 4 && (
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
                            const adv = Number(e.target.value) || 0;
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
            </Box>
          </>
        )}

        {/* Navigation Buttons */}
        <Box mt={4} display="flex" justifyContent="space-between">
          {step > 1 && (
            <Button variant="outlined" onClick={prevStep} color="#2F4F4F">
              Back
            </Button>
          )}
          {step < 4 ? (
            <Button
              variant="contained"
              onClick={nextStep}
              sx={{ backgroundColor: "#2F4F4F" }}
            >
              Next
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{ backgroundColor: "#2F4F4F" }}
            >
              Submit Bill
            </Button>
          )}
        </Box>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={
            snackbarMessage === "Purchase bill created successfully!"
              ? "success"
              : "error"
          }
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {showPrint && printData && (
        <div className="print-only">
          <GenerateBill bill={printData} billName={'PURCHASE'}/>
        </div>
      )}
    </>
  );
};
export default CreatePurchaseBill;
