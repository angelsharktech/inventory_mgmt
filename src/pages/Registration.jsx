import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
} from "@mui/material";
import { getAllPositions } from "../services/Position";
import { getAllOrganization } from "../services/Organization";
import { getAllRoles } from "../services/Role";
import { getAllUser, registerUser } from "../services/UserService";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const [step, setStep] = useState(0);

  const [organizations, setOrganizations] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [users, setUsers] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    phone_number: "",
    email: "",
    country: "",
    address: "",
    city: "",
    company_name: "",
    password: "",
    organization_id: "",
    role_id: "",
    position_id: "",
    bio: "",
    status: "active",
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
  const [errors, setErrors] = useState({
    email: "",
    phone_number: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posData, orgData, roleData, userData] = await Promise.all([
          getAllPositions(),
          getAllOrganization(),
          getAllRoles(),
          getAllUser(),
        ]);
        setPositions(posData);
        setOrganizations(orgData);
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

    if (name === "email") {
      const emailExists = users?.some(
        (u) => u?.email?.toLowerCase() === value?.toLowerCase()
      );
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        setErrors((prev) => ({ ...prev, email: "Invalid email format" }));
      } else if (emailExists) {
        setErrors((prev) => ({ ...prev, email: "Email already exists" }));
        setSnackbarMessage("Email already exists!");
        setSnackbarOpen(true);
      } else {
        setErrors((prev) => ({ ...prev, email: "" }));
      }
    }

    if (name === "phone_number") {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(value)) {
        setErrors((prev) => ({
          ...prev,
          phone_number: "Invalid mobile number",
        }));
      } else {
        setErrors((prev) => ({ ...prev, phone_number: "" }));
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleBankChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleSubmit = async () => {
    if (errors.email || errors.phone_number) {
      setSnackbarMessage("Please fix validation errors.");
      setSnackbarOpen(true);
      return;
    }

    const emailExists = users?.some(
      (u) => u?.email?.toLowerCase() === formData.email.toLowerCase()
    );
    if (emailExists) {
      setSnackbarMessage("Email already exists!");
      setSnackbarOpen(true);
      return;
    }

    const finalData = { ...formData, bankDetails };
    const result = await registerUser(finalData);

    if (result) {
      setSnackbarMessage("Register successful!");
      setSnackbarOpen(true);
      navigate("/login");
    }
  };

  // ================== RENDER SECTIONS ==================
  const renderPersonalInfo = () => (
    <>
      {[
        "first_name",
        "last_name",
        "phone_number",
        "email",
        "password",
        "country",
        "address",
        "city",
        "bio",
      ].map((key) => (
        <Grid item xs={12} sm={6} key={key}>
          <TextField
            fullWidth
            label={key
              .replace(/_/g, " ")
              .replace(/\b\w/g, (l) => l.toUpperCase())}
            name={key}
            value={formData[key]}
            type={key === "password" ? "password" : "text"}
            error={Boolean(errors[key])}
            helperText={errors[key]}
            onChange={handleChange}
          />
        </Grid>
      ))}
    </>
  );

  const renderCompanyInfo = () => (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Company Name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12} sm={6} width={250}>
        <TextField
          fullWidth
          select
          label="Organization Name"
          name="organization_id"
          value={formData.organization_id}
          onChange={handleChange}
        >
          {(organizations || []).map((org) => (
            <MenuItem key={org._id} value={org._id}>
              {org.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} width={210}>
        <TextField
          fullWidth
          select
          label="Role Name"
          name="role_id"
          value={formData.role_id}
          onChange={handleChange}
        >
          {(roles || []).map((role) => (
            <MenuItem key={role._id} value={role._id}>
              {role.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} width={250}>
        <TextField
          fullWidth
          select
          label="Position Name"
          name="position_id"
          value={formData.position_id}
          onChange={handleChange}
        >
          {(positions || []).map((pos) => (
            <MenuItem key={pos._id} value={pos._id}>
              {pos.name}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
    </>
  );

  const renderBankDetails = () => (
    <>
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
    </>
  );

  // ================== UI ==================
  return (
    <Box display="flex" minHeight="100vh">
      {/* Left Side */}
      <Box
        flex={1}
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        sx={{
          p: 6,
          background: "linear-gradient(135deg, #182848, #324b84ff)",
          color: "#fff",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
        Angel Inventory
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 500, textAlign: "center" }}>
          Simplify your factory’s financial management with our powerful billing
          platform. Register now to streamline operations and gain full control
          over your business.
        </Typography>
      </Box>

      {/* Right Side - Form */}
      <Box
        flex={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ p: 4 }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 4,
            width: 520,
            borderRadius: 3,
            backgroundColor: "rgba(255,255,255,0.95)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#182848" }}
          >
            {step === 0
              ? "Personal Info"
              : step === 1
                ? "Company Info"
                : "Bank Details"}
          </Typography>

          <Grid container spacing={2}>
            {step === 0 && renderPersonalInfo()}
            {step === 1 && renderCompanyInfo()}
            {step === 2 && renderBankDetails()}

            <Grid item xs={12} sx={{ mt: 2 }}>
              {step > 0 && (
                <Button variant="outlined" onClick={prevStep} sx={{
                  mr: 2, background: "linear-gradient(135deg, #182848, #324b84ff)",
                  color: "#fff",
                }}>
                  Back
                </Button>
              )}
              {step < 2 ? (
                <Button variant="contained" onClick={nextStep} sx={{
                  background: "linear-gradient(135deg, #182848, #324b84ff)",
                  color: "#fff",
                }}>
                  Next
                </Button>
              ) : (
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSubmit}
                  sx={{
                    background: "linear-gradient(135deg, #182848, #324b84ff)",
                    color: "#fff",
                  }}
                >
                  Submit
                </Button>
              )}
            </Grid>
          </Grid>

          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Button
              onClick={() => navigate("/login")}
              sx={{
                textTransform: "none",
                color: "#182848",
                fontWeight: "bold",
                
              }}
            >
              Login
            </Button>
          </Typography>
        </Paper>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={
            snackbarMessage === "Register successful!" ? "success" : "error"
          }
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Registration;
