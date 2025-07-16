import {
  Alert,
  Box,
  Button,
  Grid,
  Modal,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { getAllPositions } from "../../services/Position";
import { getAllRoles } from "../../services/Role";
import { getAllUser, registerUser } from "../../services/UserService";

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

const AddCustomer = ({ open, handleClose }) => {
  const { webuser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    country: "",
    address: "",
    city: "",
    bio: "",
  });

  const [bankDetails, setBankDetails] = useState({
    bankName: "",
    accountNumber: "",
    accountName: "",
    ifscCode: "",
    upiId: "",
  });

  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posData, roleData, userData] = await Promise.all([
          getAllPositions(),
          getAllRoles(),
          getAllUser(),
        ]);
        setPositions(posData);
        setRoles(roleData);
        setUsers(userData);
      } catch (err) {
        console.error("Failed to fetch form data:", err);
      }
    };
    fetchAll();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const customerRole = roles.find(
      (role) => role.name.toLowerCase() === "customer"
    );
    const customerposition = positions.find(
      (pos) => pos.name.toLowerCase() === "customer"
    );

    const phoneExists = users.find(
      (u) => u.phone_number === formData.phone_number
    );
    if (phoneExists) {
      setSnackbarMessage("Phone number already exists!");
      setSnackbarOpen(true);
      return;
    }
    if (!formData.first_name) {
      setSnackbarMessage("First Name is Required!");
      setSnackbarOpen(true);
      return;
    }
    const payload = {
      ...formData,
      bankDetails,
      organization_id: "685e8ae67615a4ca4184e0e3",
      email: "abc@example.com",
      password: "abc@example.com",
      role_id: customerRole._id,
      position_id: customerposition._id,
    };

    console.log("Submitted Customer Data:", payload);

    const result = await registerUser(payload);
    if (result) {
      setSnackbarMessage("User Added successful!");
      setSnackbarOpen(true);
      handleClose();
    }

    // Optionally reset
    setFormData({
      first_name: "",
      last_name: "",
      phone_number: "",
      country: "",
      address: "",
      city: "",
      bio: "",
    });
    setBankDetails({
      bankName: "",
      accountNumber: "",
      accountName: "",
      ifscCode: "",
      upiId: "",
    });
  };
  return (
    <>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Add Customer
          </Typography>

          <Grid container spacing={2}>
            {Object.entries(formData).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={key
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                  name={key}
                  value={value}
                  onChange={handleChange}
                  required={key === "first_name"}
                />
              </Grid>
            ))}
          </Grid>

          <Typography variant="h6" mt={2} mb={2}>
            Bank Details
          </Typography>

          <Grid container spacing={2}>
            {Object.entries(bankDetails).map(([key, value]) => (
              <Grid item xs={12} sm={6} key={key}>
                <TextField
                  fullWidth
                  label={key
                    .replace(/([A-Z])/g, " $1")
                    .replace(/^./, (str) => str.toUpperCase())}
                  name={key}
                  value={value}
                  onChange={handleBankChange}
                />
              </Grid>
            ))}
          </Grid>

          <Box mt={3} display="flex" justifyContent="flex-end">
            <Button onClick={handleClose} sx={{ mr: 2, color: "#2F4F4F" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
              onClick={handleSubmit}
            >
              Save
            </Button>
          </Box>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity={
                snackbarMessage === "User Added successful!"
                  ? "success"
                  : "error"
              }
              variant="filled"
              onClose={() => setSnackbarOpen(false)}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </Box>
      </Modal>
    </>
  );
};

export default AddCustomer;
