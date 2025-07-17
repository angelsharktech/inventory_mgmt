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
import { updateUser } from "../../services/UserService";

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

const EditVendor = ({ open, data, handleCloseEdit, refresh }) => {
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
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (data) {
          setFormData({
            first_name: data.first_name || "",
            last_name: data.last_name || "",
            phone_number: data.phone_number || "",
            country: data.country || "",
            address: data.address || "",
            city: data.city || "",
            bio: data.bio || "",
          });

          setBankDetails({
            bankName: data.bankDetails?.bankName || "",
            accountNumber: data.bankDetails?.accountNumber || "",
            accountName: data.bankDetails?.accountName || "",
            ifscCode: data.bankDetails?.ifscCode || "",
            upiId: data.bankDetails?.upiId || "",
          });
        }
      } catch (err) {
        console.error("Error loading user", err);
      }
    };

    fetchUser();
  }, [data]);

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

  const handleUpdateUser = async () => {
    try {
      const updatedUser = {
        ...formData,
        bankDetails,
      };
      const res = await updateUser(data._id, updatedUser);
      
      if (res) {
        setSnackbarMessage("Vendor Updated successful!");
        setSnackbarOpen(true);
        refresh(); 
        handleCloseEdit(); 
      } 
    } catch (error) {
      setSnackbarMessage("Failed to update Vendor! ");
        setSnackbarOpen(true);
    }
  };

  return (
    <>
      <Modal open={open} onClose={handleCloseEdit}>
        <Box sx={style}>
          <Typography variant="h6" mb={2}>
            Edit Vendor
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
            <Button onClick={handleCloseEdit} sx={{ mr: 2, color: "#2F4F4F" }}>
              Cancel
            </Button>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
              onClick={handleUpdateUser}
            >
              Update
            </Button>
          </Box>

        </Box>
      </Modal>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={3000}
            onClose={() => setSnackbarOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert
              severity={
                snackbarMessage === "Vendor Updated successful!"
                  ? "success"
                  : "error"
              }
              variant="filled"
              onClose={() => setSnackbarOpen(false)}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
    </>
  );
};

export default EditVendor;
