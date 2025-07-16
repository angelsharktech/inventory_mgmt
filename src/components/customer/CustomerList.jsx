import {
    Alert,
  Box,
  Button,
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
import AddCustomer from "./AddCustomer";
import { getAllUser } from "../../services/UserService";
import { getAllPositions } from "../../services/Position";
import { getAllRoles } from "../../services/Role";
import EditCustomer from "./EditCustomer";

const CustomerList = () => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState([]);
  const [filteredCustomers, setFilteredCustomers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);
  const [data, setData] = useState();
  const [edit, setEdit] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

      const customerRole = roles.find(
        (r) => r.name.toLowerCase() === "customer"
      );

      if (customerRole) {
        const customersOnly = data.filter(
          (u) => u.role_id === customerRole._id
        );
        setFilteredCustomers(customersOnly);
      }
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };

//   search bar code 
const filteredCustomer = filteredCustomers?.filter(
    (cust) =>
      cust.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.address?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone_number?.includes(searchQuery.toLowerCase())
  );
   const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
// --------------end of search

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEdit = () => setEdit(false);

 
  const handleEdit = (rowData) => {
    setData(rowData);
    setEdit(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        // const res = await deleteUser(id);
        // if (res) {
        //   setSnackbarMessage("Customer Deleted!");
        //   setSnackbarOpen(true);
        //   fetchProducts(); // Refresh the list
        // }
      } catch (error) {
        console.error("Error deleting customer", error);
        alert("Failed to delete customer.");
      }
    }
  };
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
            Customers
          </Typography>
          <FilterData value={searchQuery} onChange={handleSearchChange} />
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
            variant="contained"
            sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
            onClick={handleOpen}
          >
            Add Customer
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
              {filteredCustomer.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    {customer.first_name} {customer.last_name}
                  </TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(customer._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
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
            snackbarMessage === "Customer Deleted!" ? "success" : "error"
          }
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AddCustomer
        open={open}
        handleClose={handleClose}
        // refresh={fetchvendors}
      />

      <EditCustomer
        open={edit}
        data={data}
        handleCloseEdit={handleCloseEdit}
        // refresh={fetchProducts}
      />
    </>
  );
};

export default CustomerList;
