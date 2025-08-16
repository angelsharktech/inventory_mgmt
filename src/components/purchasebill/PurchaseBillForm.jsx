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
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getAllPositions } from "../../services/Position";
import { getAllRoles } from "../../services/Role";
import {
  getAllUser,
  getUserById,
  registerUser,
} from "../../services/UserService";
import {
  addProducts,
  getAllProducts,
  updateInventory,
} from "../../services/ProductService";
import { addPayment } from "../../services/PaymentModeService";
import ProductDetails from "./ProductDetails";
import BillType from "./BillType";
import PaymentDetails from "./PaymentDetails";
import VendorDetails from "./VendorDetails";
import {
  addPurchaseBill,
  deletePurchaseBill,
} from "../../services/PurchaseBillService";
import { getAllCategories } from "../../services/CategoryService";

const PurchaseBillForm = ({
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
  const [vendor, setVendor] = useState({
    _id: "",
    first_name: "",
    address: "",
    phone_number: "",
    pincode: "",
  });
  const [isExistingVendor, setIsExistingVendor] = useState(false);
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
      isExisting: false, //16.08.2025
      category: "", //16.08.2025
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
    chequeDate: "",
    balancePayMode: "",
    transactionNumber2: "",
    bankName2: "",
    chequeNumber2: "",
    cardLastFour: "",
    cardLastFour2: "",
    fullMode: "",
    fullPaid: 0,
    dueDate: "",
    financeName: "",
    cardType: "",
    utrId:"",  // 16.08.25
  });
  const [totals, setTotals] = useState(0);
  const [step, setStep] = useState(1);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [state, setState] = useState();
  const [mainUser, setMainUser] = useState();
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({ phone_number: "" });
  const [categories, setCategories] = useState([]);

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

useEffect(() => {
  const fetchCategories = async () => {
    if (!mainUser?.organization_id?._id) return; // guard
    try {
      const res = await getAllCategories();
      const parentsOnly = res.data.filter(
        (cat) =>
          cat.parent === null &&
          cat.organization_id === mainUser.organization_id._id
      );
      setCategories(parentsOnly);
    } catch (err) {
      console.error("Error loading categories", err);
    }
  };

  fetchCategories();
}, [mainUser]); // 16.08.25

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
  }, [mainUser]);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      const prod = (data?.data || []).filter(
        (p) =>
          p?.organization_id === mainUser?.organization_id?._id &&
          p.status === "active"
      );
      setProducts(prod);
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };
  const handleVendorSelection = (value, type) => {
    let selectedVendor = null;

    // Validation

    if (type === "phone") {
      // Search by phone
      const phoneRegex = /^[6-9]\d{9}$/;

      // Update vendor state
      setVendor((prev) => ({
        ...prev,
        phone_number: value,
      }));
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Invalid mobile number",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          phone_number: "",
        }));
      }
      selectedVendor = users.find(
        (u) =>
          u.phone_number === value && u.role_id.name.toLowerCase() === "vendor"
      );
    } else if (type === "name") {
      // Search by name
      selectedVendor = users.find(
        (s) =>
          s.first_name === value && s.role_id.name.toLowerCase() === "vendor"
      );
    }

    if (selectedVendor) {
      setVendor({
        _id: selectedVendor._id,
        first_name: selectedVendor.first_name,
        address: selectedVendor.address || "",
        phone_number: selectedVendor.phone_number || value,
      });
      setIsExistingVendor(true);
    } else {
      setVendor((prev) => ({
        _id: "",
        first_name: type === "name" ? value : prev.first_name, // keep existing name
        address: prev.address,
        phone_number: type === "phone" ? value : prev.phone_number, // update phone
      }));
      setIsExistingVendor(false);
    }
  };

  // const handleProductChange = (index, field, value) => {
  //   const updated = [...selectedProducts];
  //   const item = updated[index];

  //   if (field === "productName") {
  //     const product = products.find((p) => p.name === value);
  //     if (product) {
  //       const price = product.compareAtPrice || 0;
  //       const discountPrice = product.price;
  //       updated[index] = {
  //         ...item,
  //         _id: product._id,
  //         productName: product.name,
  //         hsnCode: product.hsnCode || "",
  //         price,
  //         discountPercentage: product.discountPercentage,
  //         discountedPrice: discountPrice,
  //         isExisting: true,
  //       };
  //     }
  //   }  else {
  //     updated[index][field] = value;
  //   }
  //   setSelectedProducts(updated);
  //   // else if (field === "hsnCode") {
  //   //   const product = products.find((p) => p.hsnCode === value);
  //   //   if (product) {
  //   //     const price = product.compareAtPrice || 0;
  //   //     const discountPrice = product.price;
  //   //     const discountPercentage = ((price - discountPrice) / price) * 100;

  //   //     updated[index] = {
  //   //       ...item,
  //   //       _id: product._id,
  //   //       productName: product.name,
  //   //       hsnCode: product.hsnCode,
  //   //       price,
  //   //       discountPercentage: discountPercentage,
  //   //       discountedPrice: discountPrice,
  //   //     };
  //   //   }
  //   // } else if (field === "discountPercentage") {
  //   //   const discount = parseFloat(value) || 0;
  //   //   const price = parseFloat(item.price) || 0;
  //   //   const discountPrice = price - (price * discount) / 100;

  //   //   updated[index] = {
  //   //     ...item,
  //   //     discountPercentage: discount.toFixed(0),
  //   //     discountedPrice: discountPrice,
  //   //   };
  //   // } else if (field === "discountedPrice") {
  //   //   const discountedPrice = parseFloat(value) || 0;
  //   //   const price = parseFloat(item.price) || 0;
  //   //   const discountPercentage =
  //   //     price > 0 ? ((price - discountedPrice) / price) * 100 : 0;

  //   //   updated[index] = {
  //   //     ...item,
  //   //     discountedPrice,
  //   //     discountPercentage: discountPercentage.toFixed(0),
  //   //   };
  //   // }

  // };
  const handleProductChange = (index, field, value) => {
    const updated = [...selectedProducts];
    const item = updated[index];

    if (field === "productName") {
      // always update what user types
      updated[index] = {
        ...item,
        productName: value,
        isExisting: false, // assume not existing first
      };

      // now check if this product exists in DB list
      const product = products.find((p) => p.name === value);
      if (product) {
        const price = product.compareAtPrice || 0;
        const discountPrice = product.price;
        updated[index] = {
          ...item,
          _id: product._id,
          productName: product.name,
          hsnCode: product.hsnCode || "",
          price,
          discountPercentage: product.discountPercentage || 0,
          discountedPrice: discountPrice,
          isExisting: true,
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
        qty: 1,
        price: 0,
        gst: 0,
        discountPercentage: 0,
        discountedPrice: 0,
        category: "", //16.08.2025
      },
    ]);
  };

  const handleRemoveProduct = (index) => {
    const updated = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updated);
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setVendor({ ...vendor, pincode });

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
      let finalVendor = { ...vendor };

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
          email:
            vendor.first_name.replace(/\s+/g, "").toLowerCase() +
            "@example.com",
          password:
            vendor.first_name.replace(/\s+/g, "").toLowerCase() +
            "@example.com",
          role_id: vendorRole._id,
          position_id: vendorposition._id,
        };
        const res = await registerUser(payload);
        finalVendor = { ...vendor, _id: res.user.id };
      }
      // 16.08.2025
      for (let prod of selectedProducts) {
        if (!prod.isExisting) {
          const newProductPayload = {
            name: prod.productName,
            category: prod.category,
            hsnCode: prod.hsnCode,
            price: prod.discountedPrice,
            compareAtPrice: prod.price,
            category: prod.category, 
            quantity: prod.qty,
            organization_id: mainUser.organization_id?._id,
            status: "active",
          };
          const res = await addProducts(newProductPayload);
          prod._id = res.data._id; // update with new product id
          prod.isExisting = true; // mark as saved
        } else {
          const updatePayload = {
            quantity: Number(prod.qty) || 0,
            action: "add", // or "add" if you want to increase instead of overwrite
          };

          await updateInventory(prod._id, updatePayload);
        }
      }
      const finalProducts = selectedProducts.map((product) => ({
        _id: product._id,
        name: product.productName,
        hsnCode: product.hsnCode,
        qty: Number(product.qty),
        price: Number(product.discountedPrice),
        unitPrice: Number(product.price),
        discount: Number(product.discountPercentage) || 0,
      }));

      const billPayload = {
        // bill_number: setInvoiceNumber,
        bill_to: finalVendor._id,
        products: finalProducts,
        billType: billType,
        qty: selectedProducts.length,
        paymentType: paymentType,
        advance: paymentDetails.advance,
        balance: paymentDetails.balance,
        balancePayMode:
          paymentDetails.balancePayMode + "-" + paymentDetails.financeName,
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
        status: "draft",
      };
      console.log("Bill Payload:", billPayload);

      const res = await addPurchaseBill(billPayload);
      if (res.success === false) {
        setSnackbarMessage(res.message || "Failed to create purchase bill");
        setSnackbarOpen(true);
        return;
      }

      if (res.status === 401) {
        setSnackbarMessage("Your session is expired Please login again!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
        return;
      }

      if (res.success === true) {
        setSnackbarMessage("Purchase bill created successfully!");
        setSnackbarOpen(true);
        const billData = {
          biller: finalVendor,
          products: finalProducts,
          billType,
          paymentType,
          paymentDetails,
          gstPercent,
          totals,
          org: mainUser.organization_id?.name,
        };

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
            client_id: finalVendor._id, //customer_id
            purchasebill: res?.data?._id, //purchase_bill_id
            organization: mainUser.organization_id?._id,
            billType: "purchase",
          };

          // Add mode-specific fields
          if (
            paymentDetails.advpaymode.toLowerCase() === "upi" ||
            paymentDetails.fullMode.toLowerCase() === "upi"
          ) {
            paymentPayload = {
              ...paymentPayload,
              upiId: paymentDetails.transactionNumber,
            };
          } else if (
            paymentDetails.advpaymode.toLowerCase() === "cheque" ||
            paymentDetails.fullMode.toLowerCase() === "cheque"
          ) {
            paymentPayload = {
              ...paymentPayload,
              bankName: paymentDetails.bankName,
              chequeNumber: paymentDetails.chequeNumber,
              chequeDate: paymentDetails.chequeDate,
            };
          } else if (
            paymentDetails.advpaymode.toLowerCase() === "card" ||
            paymentDetails.fullMode.toLowerCase() === "card"
          ) {
            paymentPayload = {
              ...paymentPayload,
              cardType: paymentDetails.cardType,
              cardLastFour: paymentDetails.cardLastFour,
            };
          } else if (
            paymentDetails.advpaymode.toLowerCase() === "finance" ||
            paymentDetails.balancePayMode.toLowerCase().includes("finance") ||
            paymentDetails.fullMode.toLowerCase() === "finance"
          ) {
            paymentPayload = {
              ...paymentPayload,
              financeName: paymentDetails.financeName,
            };
          }else if (
            paymentDetails.advpaymode.toLowerCase() === "online transfer" ||
            paymentDetails.balancePayMode.toLowerCase()==="online transfer" ||
            paymentDetails.fullMode.toLowerCase() === "online transfer"
          ) {
            paymentPayload = {
              ...paymentPayload,
              utrId: paymentDetails.utrId,
            };  // 16.08.25
          } else {
            paymentPayload = {
              ...paymentPayload,
              description: `${
                paymentType === "advance" ? "Advance" : "Full"
              } payment for Bill`,
            };
          }

          const paymentResult = await addPayment(paymentPayload);
          if (paymentResult.success === false) {
            await deletePurchaseBill(res.data._id);
            setSnackbarMessage(paymentResult.errors);
            setSnackbarOpen(true);
            return;
          } else {
            setPrintData(billData);
            setShowPrint(true); // Show bill for printing
            setTimeout(() => {
              window.print();
              setShowPrint(false); // Optional
            }, 500);
            if (refresh) {
              refresh();
            }
          }
        }

        setStep(1);
        setVendor({
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
          chequeDate: "",
          balancePayMode: "",
          transactionNumber2: "",
          bankName2: "",
          chequeNumber2: "",
          cardLastFour: "",
          cardLastFour2: "",
          fullMode: "",
          fullPaid: 0,
          dueDate: "",
        });
        close();
      }
    } catch (error) {
      console.log(error);

      setSnackbarMessage("Vendor " + error);
      setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Typography variant="h5" gutterBottom>
        Create purchase Bill
      </Typography>

      {/* Step 1: vendor Info */}
      {step === 1 && (
        <VendorDetails
          vendor={vendor}
          isExistingVendor={isExistingVendor}
          handleVendorSelection={handleVendorSelection}
          setVendor={setVendor}
          errors={errors}
          supplierList={users.filter(
            (u) =>
              u.role_id?.name?.toLowerCase() === "vendor" &&
              u.organization_id?._id === mainUser?.organization_id?._id &&
              u.status === "active"
          )}
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
          categories={categories}   // 16.08.25
        />
      )}

      {/* Step 3: Bill Type */}
      {step === 3 && (
        <BillType
          billType={billType}
          setBillType={setBillType}
          gstPercent={gstPercent}
          setGstPercent={setGstPercent}
          vendor={vendor}
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

export default PurchaseBillForm;
