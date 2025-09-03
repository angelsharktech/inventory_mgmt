import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  InputAdornment,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/UserService";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { loginData } = useAuth();
  const [credentials, setCredentials] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await loginUser(credentials);
      if (res) {
        loginData(res.user, res.token);
        localStorage.setItem("token", res.token);
        setSnackbarMessage("Login successful!");
        setShowSnackbar(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 600);
      }
    } catch (err) {
      if (err.error) {
        setSnackbarMessage(err.error);
      } else if (err.message) {
        setSnackbarMessage(err.message);
      } else {
        setSnackbarMessage("Something went wrong!");
      }
      setShowSnackbar(true);
    }
  };

  return (
    <Box display="flex" minHeight="100vh">
      {/* Left Side - Info Section */}
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
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <Typography variant="h3" fontWeight="bold" gutterBottom>
         Angel Inventory
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 500, textAlign: "center" }}>
          Manage your sugar factory operations with ease – from cane procurement
          to Inventory. Our software helps you track payments, invoices, and
          production efficiently.
        </Typography>
      </Box>

      {/* Right Side - Login Form */}
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
            width: 380,
            borderRadius: 3,
            backdropFilter: "blur(8px)",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
        >
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#182848" }}
          >
            Login
          </Typography>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <TextField
              label="Email"
              name="email"
              type="email"
              variant="outlined"
              fullWidth
              margin="normal"
              value={credentials.email}
              onChange={handleChange}
              required
            />

            {/* Password */}
            <TextField
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              margin="normal"
              value={credentials.password}
              onChange={handleChange}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            {/* Login Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                py: 1.5,
                fontSize: "16px",
                fontWeight: "bold",
                background: "linear-gradient(135deg, #182848, #324b84ff)",
                color: "#fff",
              }}
            >
              Login
            </Button>

            {/* Register link */}
            <Typography align="center" sx={{ mt: 2 }}>
              Don’t have an account?{" "}
              <Button
                onClick={() => navigate("/register")}
                sx={{
                  textTransform: "none",
                  color: "#182848",
                  fontWeight: "bold",
                }}
              >
                Register here
              </Button>
            </Typography>
          </form>
        </Paper>
      </Box>

      {/* Snackbar for login success/error */}
      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={snackbarMessage === "Login successful!" ? "success" : "error"}
          onClose={() => setShowSnackbar(false)}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Login;
