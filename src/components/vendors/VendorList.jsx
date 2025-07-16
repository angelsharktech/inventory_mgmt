import {
  Alert,
  Box,
  Button,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterData from "../shared/FilterData";
import AddVendor from "./AddVendor";
import { getAllPositions } from "../../services/Position";
import { getAllRoles } from "../../services/Role";
import { getAllUser } from "../../services/UserService";

const VendorList = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [positions, setPositions] = useState([]);
   const [user, setUser] = useState([]);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posData, roleData] = await Promise.all([
          getAllPositions(),
          getAllRoles(),
        ]);
        setPositions(posData);
        setRoles(roleData);
      } catch (err) {
        console.error("Failed to fetch form data:", err);
      }
    };
    fetchAll();
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await getAllUser();
      setUser(data);

      const vendorRole = roles.find(
        (r) => r.name.toLowerCase() === "vendor"
      );

      if (vendorRole) {
        const vendorsOnly = data.filter(
          (u) => u.role_id === vendorRole._id
        );
        setFilteredVendors(vendorsOnly);
      }
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const filteredvendor = filteredVendors?.filter(
    (ven) =>
      ven.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ven.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ven.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ven.phone_number?.includes(searchQuery.toLowerCase())
  );
   const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
// --------------end of search

  return (
    <>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h4" fontWeight={600}>
            Vendors
          </Typography>
          <FilterData value={searchQuery} onChange={handleSearchChange} />
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
            onClick={handleOpen}
          >
            Add vendor
          </Button>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            width: { xs: "30%", sm: "65%", md: "55%", lg: "100%" },
            overflowX: "auto",
          }}
        >
          <Table sx={{ minWidth: 1000 }}>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>City</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Edit</TableCell>
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredvendor.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell>
                    {vendor.first_name} {vendor.last_name}
                  </TableCell>
                  <TableCell>{vendor.phone_number}</TableCell>
                  <TableCell>{vendor.city}</TableCell>
                  <TableCell>{vendor.address}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(vendor)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  {/* <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(vendor._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

       <Snackbar
              open={snackbarOpen}
              autoHideDuration={3000}
              onClose={() => setSnackbarOpen(false)}
              anchorOrigin={{ vertical: "top", horizontal: "center" }}
            >
              <Alert 
                severity={
                  snackbarMessage === "vendor Deleted!" ? "success" : "error"
                }
                onClose={() => setSnackbarOpen(false)}
                variant="filled"
              >
                {snackbarMessage}
              </Alert>
            </Snackbar>

      <AddVendor
        open={open}
        handleClose={handleClose}
        // refresh={fetchvendors}
      />
    </>
  );
};

export default VendorList;
