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
import { getAllUser, getUserById, updateUser } from "../../services/UserService";
import EditVendor from "./EditVendor";
import PaginationComponent from "../shared/PaginationComponent";
import { useAuth } from "../../context/AuthContext";

const VendorList = () => {
  const { webuser } = useAuth();
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);
  const [data, setData] = useState();
  const [searchQuery, setSearchQuery] = useState("");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [filteredVendors, setFilteredVendors] = useState([]);
  const [positions, setPositions] = useState([]);
  const [user, setUser] = useState([]);
   const [mainUser, setMainUser] = useState();
  const [roles, setRoles] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [posData, roleData,user] = await Promise.all([
          getAllPositions(),
          getAllRoles(),
          getUserById(webuser.id)
        ]);
        setPositions(posData);
        setRoles(roleData);
        setMainUser(user)
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

      const vendorRole = roles.find((r) => r.name.toLowerCase() === "vendor");
      // if (vendorRole) {
      //   const vendorsOnly = data.filter(
      //     (u) =>{console.log(u.role_id?._id +" " + vendorRole?._id + " "+u.status + " "+  u.organization_id?._id +" "+ mainUser.organization_id?._id)}
      //   );
        if (vendorRole) {
          const vendorsOnly = data.filter(
            (u) => u.role_id?._id === vendorRole?._id && 
                   u.status === "active" && 
                   u.organization_id?._id === mainUser.organization_id?._id
          );
        setFilteredVendors(vendorsOnly);
      }
    } catch (error) {
      console.error("Error fetching product data", error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseEdit = () => setEdit(false);

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
  useEffect(() => {
    if (filteredvendor) {
      setTotalPages(Math.ceil(filteredvendor.length / pageSize));
    }
  }, [filteredvendor]);
  const paginatedVendors = filteredvendor?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleEdit = (rowData) => {
    setData(rowData);
    setEdit(true);
  };
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        const updatedUser = {
          status: "inactive",
        };
        const res = await updateUser(id, updatedUser);

        if (res) {
          setSnackbarMessage("Vendor Deleted!");
          setSnackbarOpen(true);
          fetchUsers(); // Refresh the list
        }
      } catch (error) {
        console.error("Error deleting vendor", error);
        alert("Failed to delete vendor.");
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
            Suppliers
          </Typography>
          <FilterData value={searchQuery} onChange={handleSearchChange} />
        </Box>

        <Box display="flex" justifyContent="flex-end" mb={2}>
          <Button
          // accessKey="l"
            variant="contained"
            sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
            onClick={handleOpen}
          >
            Add Supplier(alt+l)
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
                <TableCell>
                  <strong>Name</strong>
                </TableCell>
                <TableCell>
                  <strong>Contact Number</strong>
                </TableCell>
                {/* <TableCell>
                  <strong>City</strong>
                </TableCell> */}
                <TableCell>
                  <strong>Address</strong>
                </TableCell>
                <TableCell>
                  <strong>Actions</strong>
                </TableCell>
                
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedVendors.map((vendor) => (
                <TableRow key={vendor._id}>
                  <TableCell>
                    {vendor.first_name} {vendor.last_name}
                  </TableCell>
                  <TableCell>{vendor.phone_number}</TableCell>
                  <TableCell>{vendor.address}  {vendor.city}</TableCell>
                  {/* <TableCell></TableCell> */}
                  <TableCell>
                    <IconButton
                      color="primary"
                      onClick={() => handleEdit(vendor)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(vendor._id)}
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
          severity={snackbarMessage === "vendor Deleted!" ? "success" : "error"}
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      <AddVendor open={open} handleClose={handleClose} refresh={fetchUsers} />
      <EditVendor
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

export default VendorList;
