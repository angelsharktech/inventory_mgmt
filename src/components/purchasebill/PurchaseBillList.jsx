import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  TextField,
  IconButton,
  Alert,
  Snackbar,
} from "@mui/material";
import moment from "moment";
import { Visibility } from "@mui/icons-material";
import EditIcon from "@mui/icons-material/Edit";
import {
  getAllPurchaseBills,
  getPurchaseBillByOrganization,
} from "../../services/PurchaseBillService";
import CreatePurchaseBill from "./CreatePurchaseBill";
import ViewBill from "./ViewBill";
import EditBill from "./EditBill";
import { useAuth } from "../../context/AuthContext";
import { getUserById } from "../../services/UserService";
import PaginationComponent from "../shared/PaginationComponent";
import { useNavigate } from "react-router-dom";

const PurchaseBillList = () => {
  const { webuser } = useAuth();
  const navigate = useNavigate();
  const [mainUser, setMainUser] = useState();
  const [bills, setBills] = useState([]);
  const [data, setData] = useState();
  const [editData, setEditData] = useState();
  const [view, setView] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleCloseEdit = () => setEdit(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleCloseView = () => setView(false);

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(webuser?.id);
      setMainUser(user);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (mainUser) {
      fetchBills(currentPage);
    }
  }, [currentPage, mainUser]);

  const fetchBills = async (page = 1) => {
    if (!mainUser) return;

    const data = await getPurchaseBillByOrganization(
      mainUser?.organization_id?._id,
      page
    );
    if (data.status === 401) {
      setSnackbarMessage("Your Session is expired. Please login again!");
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    }
    if (data.success === true) {
      const allBills = data.data.docs || [];
      setBills(allBills);
      setTotalPages(data.data.totalPages || 1);
      setCurrentPage(data.data.page || page);
    }
  };

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      if (!bill.createdAt) return false;
      const billDate = new Date(bill.createdAt);
      const selectedDate = startDate ? new Date(startDate) : null;

      if (!selectedDate) return true;

      // Normalize both to remove time portion
      billDate.setHours(0, 0, 0, 0);
      selectedDate.setHours(0, 0, 0, 0);

      // Return only bills matching that exact date
      return billDate.getTime() === selectedDate.getTime();
    });
  }, [bills, startDate]);

  const totalBill = filteredBills.reduce(
    (acc, bill) => acc + (bill.grandTotal || 0),
    0
  );
  const totalPaid = filteredBills.reduce(
    (acc, bill) => acc + Number(bill.advance || 0) + Number(bill.fullPaid || 0),
    0
  );
  const totalbal = filteredBills.reduce(
    (acc, bill) => acc + Number(bill.balance || 0),
    0
  );

  const handleView = (rowData) => {
    setData(rowData);
    setView(true);
  };
  const handleEditBill = (rowData) => {
    setEditData(rowData);
    setEdit(true);
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
          <Typography variant="h5" fontWeight={600}>
            Purchase Bill Summary
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2} mr={4}>
            <TextField
              label="Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => {
                setStartDate(e.target.value);
              }}
              size="small"
            />
            {/* <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              disabled={!startDate} // Disable until start date is selected
              inputProps={{
                min: startDate || moment().format("YYYY-MM-DD"), // Disable dates before start date
              }}
            /> */}

            <Button
              variant="contained"
              sx={{ backgroundColor: "#2F4F4F", color: "#fff" }}
              onClick={handleOpen}
            >
              Create Purchase bill
            </Button>
          </Box>
        </Box>

        <TableContainer
          component={Paper}
          sx={{
            maxWidth: 1100,
            margin: "5px auto",
            maxHeight: 550,
            overflowY: "auto",
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>#</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Vendor Name</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Invoice No.</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Bill Date</strong>
                </TableCell>
                <TableCell align="right" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Bill Total (₹)</strong>
                </TableCell>
                <TableCell align="right" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Payment Type</strong>
                </TableCell>
                <TableCell align="right" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Paid Amount (₹)</strong>
                </TableCell>
                <TableCell align="right" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Balance Amount (₹)</strong>
                </TableCell>
                {/* <TableCell align="right" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Payment Mode</strong>
                </TableCell>
                <TableCell align="right" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Transaction Number</strong>
                </TableCell> */}
                <TableCell align="center" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Action</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredBills.map((bill, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{bill.bill_to?.first_name || "N/A"}</TableCell>
                  <TableCell>{bill.bill_number || "N/A"}</TableCell>
                  <TableCell>
                    {bill.createdAt
                      ? moment(bill.createdAt).format("DD/MM/YYYY")
                      : "--"}
                  </TableCell>
                  <TableCell align="right">
                    {bill.grandTotal?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell align="center">
                    {bill.paymentType || "N/A"}
                  </TableCell>
                  <TableCell align="right">
                    {(
                      Number(bill.advance || 0) + Number(bill.fullPaid || 0)
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell align="right">
                    {bill.balance?.toFixed(2) || "0.00"}
                  </TableCell>
                  {/* <TableCell align="center">
                    {bill.paymentType === "advance"
                      ? "Advance"
                      : bill.paymentType === "full"
                      ? "Full"
                      : "N/A"}
                  </TableCell> */}
                  {/* <TableCell align="center">
                    {bill.referenceId || "N/A"}
                  </TableCell> */}
                  <TableCell align="center">
                    <IconButton
                      color="inherit"
                      onClick={() => handleView(bill._id)}
                    >
                      <Visibility color="primary" />
                    </IconButton>
                    <IconButton
                      color="inherit"
                      onClick={() => handleEditBill(bill)}
                    >
                      <EditIcon color="primary" />
                    </IconButton>
                  </TableCell>
                  {/* <TableCell align="center">
                  </TableCell> */}
                </TableRow>
              ))}

              {/* Totals */}
              <TableRow
                sx={{
                  position: "sticky",
                  bottom: 0,
                  zIndex: 1,
                  background: "#e0e0e0ff",
                  fontWeight: "bold",
                }}
              >
                <TableCell colSpan={3}>
                  <strong>Total Bills: {filteredBills.length}</strong>
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <strong>Total Amount: {totalBill.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right" colSpan={2}>
                  <strong>Total Paid: {totalPaid.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right" colSpan={3}>
                  <strong>Balance: {totalbal.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
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
          severity={snackbarMessage === " " ? "success" : "error"}
          variant="filled"
          onClose={() => setSnackbarOpen(false)}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <CreatePurchaseBill
        open={open}
        handleClose={handleClose}
        refresh={fetchBills}
      />
      <EditBill
        open={edit}
        data={editData}
        handleCloseEdit={handleCloseEdit}
        refresh={fetchBills}
      />
      <ViewBill open={view} data={data} handleCloseView={handleCloseView} />
      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default PurchaseBillList;
