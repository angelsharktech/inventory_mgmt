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
  TextField,
  Typography,
  IconButton,
  Divider,
} from "@mui/material";
import { Delete } from "@mui/icons-material";
import { getAllProducts } from "../../services/ProductService";
import {
  getAllUser,
  getUserById,
  registerUser,
} from "../../services/UserService";
import { getAllPositions } from "../../services/Position";
import { getAllRoles } from "../../services/Role";
import { useAuth } from "../../context/AuthContext";
import PaymentDetails from "./PaymentDetails";
import { addSaleBill } from "../../services/SaleBillService";
import ProductDetails from "./ProductDetails";
import BillType from "./BillType";
import CustomerDetails from "./CustomerDetails";
import { addPayment } from "../../services/PaymentModeService";
import { useNavigate } from "react-router-dom";

const SaleBillForm = ({
  setShowPrint,
  setPrintData,
  setSnackbarOpen,
  setSnackbarMessage,
  // setInvoiceNumber,
  close,
  refresh,
}) => {
  const { webuser } = useAuth();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState({
    _id: "",
    first_name: "",
    address: "",
    phone_number: "",
    pincode: "",
  });
  const [isExistingCustomer, setIsExistingCustomer] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([
    {
      _id: "",
      productName: "",
      hsnCode: "",
      qty: 1,
      price: 0,
      gst: 0,
      discountPercentage: 0,
      discountedPrice: 0,
    },
  ]);
  const [billType, setBillType] = useState("non-gst");
  const [gstPercent, setGstPercent] = useState(0);
  const [paymentType, setPaymentType] = useState("full");
  const [paymentDetails, setPaymentDetails] = useState({
    advance: 0,
    balance: 0,
    advpaymode: "",
    transactionNumber: "",
    bankName: "",
    chequeNumber: "",
    balpaymode: "",
    transactionNumber2: "",
    bankName2: "",
    chequeNumber2: "",
    cardNumber: "",
    cardNumber2: "",
    fullMode: "",
    fullPaid: 0,
    dueDate: "",
  });
  const [totals, setTotals] = useState(0);
  const [step, setStep] = useState(1);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [state, setState] = useState();
  const [mainUser, setMainUser] = useState();
  const [notes, setNotes] = useState("");

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

  // Calculating totals
  useEffect(() => {
    let subtotal = 0;
    selectedProducts.forEach((item) => {
      const qty = Number(item.qty);
      const taxable = qty * item.discountedPrice;
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

  // Fetch product data
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

  const handleMobile = async (phone) => {
    const phoneExists = users.find(
      (u) =>
        u.phone_number === phone && u.role_id.name.toLowerCase() === "customer"
    );

    if (phoneExists) {
      setCustomer({
        _id: phoneExists._id,
        first_name: phoneExists.first_name,
        address: phoneExists.address,
        phone_number: phone,
      });
      setIsExistingCustomer(true);
    } else {
      setCustomer({
        _id: "",
        first_name: "",
        address: "",
        phone_number: phone,
      });
      setIsExistingCustomer(false);
    }
  };

  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];
    const item = updated[index];

    if (field === "productName") {
      const product = products.data.find((p) => p.name === value);
      if (product) {
        const price = product.compareAtPrice || 0;
        const discountPrice = product.price;
        updated[index] = {
          ...item,
          _id: product._id,
          productName: product.name,
          hsnCode: product.hsnCode || "",
          price,
          discountPercentage: product.discountPercentage,
          discountedPrice: discountPrice,
        };
      }
    } else if (field === "hsnCode") {
      const product = products.data.find((p) => p.hsnCode === value);
      if (product) {
        const price = product.compareAtPrice || 0;
        const discountPrice = product.price;
        const discountPercentage = ((price - discountPrice) / price) * 100;

        updated[index] = {
          ...item,
          _id: product._id,
          productName: product.name,
          hsnCode: product.hsnCode,
          price,
          discountPercentage: discountPercentage,
          discountedPrice: discountPrice,
        };
      }
    } else if (field === "discountPercentage") {
      const discount = parseFloat(value) || 0;
      const price = parseFloat(item.price) || 0;
      const discountPrice = price - (price * discount) / 100;

      updated[index] = {
        ...item,
        discountPercentage: discount.toFixed(0),
        discountedPrice: discountPrice,
      };
    } else if (field === "discountedPrice") {
      const discountedPrice = parseFloat(value) || 0;
      const price = parseFloat(item.price) || 0;
      const discountPercentage =
        price > 0 ? ((price - discountedPrice) / price) * 100 : 0;

      updated[index] = {
        ...item,
        discountedPrice,
        discountPercentage: discountPercentage.toFixed(0),
      };
    } else {
      updated[index][field] = value;
    }
    setSelectedProducts(updated);
  };

  const handleAddProduct = () => {
    setSelectedProducts([
      ...selectedProducts,
      {
        productName: "",
        hsnCode: "",
        qty: 0,
        price: 0,
        gst: 0,
        discountPercentage: 0,
        discountedPrice: 0,
      },
    ]);
  };

  const handleRemoveProduct = (index) => {
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setCustomer({ ...customer, pincode });

    if (pincode.length === 6) {
      try {
        const res = await fetch(
          `https://api.postalpincode.in/pincode/${pincode}`
        );
        if (!res.ok) {
          setSnackbarMessage("API response not OK");
          setSnackbarOpen(true);
          return;
        }
        const data = await res.json();
        const stateFind = data[0]?.PostOffice?.[0]?.State || "Not Found";
        if (stateFind === "Not Found") {
          setSnackbarMessage("State Not Found!");
          setSnackbarOpen(true);
          return;
        }
        setState(stateFind);
      } catch (error) {
        console.error("Error fetching state from pincode", error);
      }
    }
  };

  const handleSubmit = async () => {
    try {
      let finalCustomer = { ...customer };
      let advancePaymentId = null;
      let fullPaymentId = null;

      if (!customer.phone_number || !customer.first_name) {
        setSnackbarMessage("Please fill customer details!");
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

      if (!isExistingCustomer) {
        const customerRole = roles.find(
          (role) => role.name.toLowerCase() === "customer"
        );
        const customerposition = positions.find(
          (pos) => pos.name.toLowerCase() === "customer"
        );
        const payload = {
          ...customer,
          organization_id: mainUser.organization_id?._id,
          email: customer.first_name + "@example.com",
          password: customer.first_name + "@example.com",
          role_id: customerRole._id,
          position_id: customerposition._id,
        };
        const res = await registerUser(payload);
        finalCustomer = { ...customer, _id: res.user.id };
      }

      const productIds = selectedProducts.map((product) => product._id);

      const billPayload = {
        // bill_number: setInvoiceNumber,
        bill_to: finalCustomer._id,
        products: productIds,
        billType: billType,
        qty: selectedProducts.length,
        paymentType: paymentType,
        advance: paymentDetails.advance,
        balance: paymentDetails.balance,
        fullPaid: paymentDetails.fullPaid,
        subtotal: totals.subtotal,
        discount: 0,
        gstPercent: gstPercent,
        gstTotal: totals.gstTotal,
        cgst: totals.cgst,
        sgst: totals.sgst,
        igst: totals.igst,
        grandTotal: totals.grandTotal,
        org: mainUser.organization_id?._id,
        dueDate: paymentDetails.dueDate,
        notes: notes,
        createdBy: mainUser._id,
        status: paymentDetails.balance === 0 ? "issued" : "draft",
      };
      const res = await addSaleBill(billPayload);
      if (res.status === 401) {
        setSnackbarMessage("Your session is expired Please login again!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }
      if (res.success === true) {
        setSnackbarMessage("Sale bill created successfully!");
        setSnackbarOpen(true);
        const billData = {
          biller: finalCustomer,
          products: selectedProducts,
          billType,
          paymentType,
          paymentDetails,
          gstPercent,
          totals,
          org: mainUser.organization_id?.name,
        };

        setPrintData(billData);
        setShowPrint(true); // Show bill for printing
        setTimeout(() => {
          window.print();
          setShowPrint(false); // Optional
        }, 500);
        refresh();
        setStep(1);
        setCustomer({
          first_name: "",
          address: "",
          phone_number: "",
        });
        setSelectedProducts([
          {
            productName: "",
            hsnCode: "",
            qty: 0,
            price: 0,
            discountPercentage: 0,
            gst: 0,
            discountedPrice: 0,
          },
        ]);
        setPaymentDetails({
          advance: 0,
          balance: 0,
          advpaymode: "",
          transactionNumber: "",
          bankName: "",
          chequeNumber: "",
          balpaymode: "",
          transactionNumber2: "",
          bankName2: "",
          chequeNumber2: "",
          cardNumber: "",
          cardNumber2: "",
          fullMode: "",
          fullPaid: 0,
          dueDate: "",
        });

        close();

        if (paymentType === "advance" || paymentType === "full") {
          // Base payload with common fields
          let paymentPayload = {
            paymentType:
              paymentType === "advance"
                ? paymentDetails.advpaymode
                : paymentDetails.fullMode, // or paymentDetails.paymode for full payment
            amount:
              paymentType === "advance"
                ? paymentDetails.advance
                : paymentDetails.fullPaid,
            client_id: finalCustomer._id,
            work_id: res._id,
            organization: mainUser.organization_id?._id,
          };

          // Add mode-specific fields
          if (
            paymentDetails.advpaymode.toLowerCase() === "upi" ||
            paymentDetails.fullMode.toLowerCase() === "upi"
          ) {
            paymentPayload = {
              ...paymentPayload,
              referenceId: paymentDetails.transactionNumber,
            };
          } else if (
            paymentDetails.advpaymode.toLowerCase() === "cheque" ||
            paymentDetails.fullMode.toLowerCase() === "cheque"
          ) {
            paymentPayload = {
              ...paymentPayload,
              bankName: paymentDetails.bankName,
              chequeNumber: paymentDetails.chequeNumber,
            };
          } else {
            paymentPayload = {
              ...paymentPayload,
              description: `${
                paymentType === "advance" ? "Advance" : "Full"
              } payment for Bill`,
            };
          }

          const paymentResult = await addPayment(paymentPayload);
          if (paymentResult.success) {
          }
        }
      }
    } catch (error) {
      setSnackbarMessage("Customer " + error);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Create Sale Bill
      </Typography>

      {/* Step 1: Customer Info */}
      {step === 1 && (
        <CustomerDetails
          customer={customer}
          isExistingCustomer={isExistingCustomer}
          handleMobile={handleMobile}
          setCustomer={setCustomer}
        />
      )}

      {/* Step 2: Product Details */}
      {step === 2 && (
        <ProductDetails
          products={products}
          selectedProducts={selectedProducts}
          handleProductChange={handleProductChange}
          handleAddProduct={handleAddProduct}
          handleRemoveProduct={handleRemoveProduct}
        />
      )}

      {/* Step 3: Bill Type */}
      {step === 3 && (
        <BillType
          billType={billType}
          setBillType={setBillType}
          gstPercent={gstPercent}
          setGstPercent={setGstPercent}
          customer={customer}
          handlePincodeChange={handlePincodeChange}
          state={state}
          totals={totals}
        />
      )}

      {/* Step 4: Payment Type */}
      {step === 4 && (
        <PaymentDetails
          paymentType={paymentType}
          setPaymentType={setPaymentType}
          paymentDetails={paymentDetails}
          setPaymentDetails={setPaymentDetails}
          totals={totals}
          notes={notes}
          setNotes={setNotes}
        />
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
    </>
  );
};

export default SaleBillForm;
