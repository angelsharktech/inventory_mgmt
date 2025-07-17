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
  IconButton,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterData from "../shared/FilterData";
import AddCustomer from "./AddCustomer";
import { getAllUser, updateUser } from "../../services/UserService";
import { getAllPositions } from "../../services/Position";
import { getAllRoles } from "../../services/Role";
import EditCustomer from "./EditCustomer";
import PaginationComponent from "../shared/PaginationComponent";

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
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

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
  useEffect(() => {
    if (roles && roles.length > 0) {
      fetchUsers();
    }
  }, [roles]);
  const fetchUsers = async () => {
    try {
      const data = await getAllUser();
      setUser(data);

      const customerRole = roles.find(
        (r) => r.name.toLowerCase() === "customer"
      );
      if (customerRole) {
        const customersOnly = data.filter(
          (u) => u.role_id._id === customerRole._id && u.status === "active"
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
  useEffect(() => {
    if (filteredCustomer) {
      setTotalPages(Math.ceil(filteredCustomer.length / pageSize));
    }
  }, [filteredCustomer]);
  const paginatedCustomers = filteredCustomer?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEdit = () => setEdit(false);

  const handleEdit = (rowData) => {
    setData(rowData);
    setEdit(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Customer?")) {
      try {
        const updatedUser = {
          status: "inactive",
        };
        const res = await updateUser(id, updatedUser);

        if (res) {
          setSnackbarMessage("Customer Deleted!");
          setSnackbarOpen(true);
          fetchUsers(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting Customer", error);
        alert("Failed to delete Customer.");
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
            <TableHead sx={{ backgroundColor: "lightgrey" }}>
              <TableRow>
                <TableCell><strong>Name</strong></TableCell>
                <TableCell><strong>Phone</strong></TableCell>
                <TableCell><strong>City</strong></TableCell>
                <TableCell><strong>Address</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer._id}>
                  <TableCell>
                    {customer.first_name} {customer.last_name}
                  </TableCell>
                  <TableCell>{customer.phone_number}</TableCell>
                  <TableCell>{customer.city}</TableCell>
                  <TableCell>{customer.address}</TableCell>
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(customer)}
                    >
                      <EditIcon />
                    </IconButton>
                  </TableCell>
                  <TableCell>
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

      <AddCustomer open={open} handleClose={handleClose} refresh={fetchUsers} />

      <EditCustomer
        open={edit}
        data={data}
        handleCloseEdit={handleCloseEdit}
        refresh={fetchUsers}
      />

       <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default CustomerList;
