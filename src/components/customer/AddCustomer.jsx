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
import { getAllUser, getUserById, registerUser } from "../../services/UserService";

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

const AddCustomer = ({ open, handleClose ,refresh }) => {
  const { webuser } = useAuth();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    country: "",
    address: "",
    city: "",
  });

  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);
  const [mainUser, setMainUser] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posData, roleData, userData , user] = await Promise.all([
          getAllPositions(),
          getAllRoles(),
          getAllUser(),
          getUserById(webuser.id)
        ]);
        setPositions(posData);
        setRoles(roleData);
        setUsers(userData);
        setMainUser(user)
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
      organization_id: mainUser.organization_id?._id,
      email: formData.first_name +"@example.com",
      password: formData.first_name +"@example.com",
      role_id: customerRole._id,
      position_id: customerposition._id,
    };
try {
   const result = await registerUser(payload);
    if (result) {
      setSnackbarMessage("Customer Added successful!");
      setSnackbarOpen(true);
      refresh();
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
     
    });
   
} catch (error) {
  setSnackbarMessage(error);
      setSnackbarOpen(true);
}
   
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
                snackbarMessage === "Customer Added successful!"
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

export default AddCustomer;
