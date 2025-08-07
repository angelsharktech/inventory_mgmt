import React, { useEffect, useMemo, useRef, useState } from "react";
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
  MenuItem,
  Menu,
  Box,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { exportToExcel, exportToPDF } from "../shared/Export";
import moment from "moment";
import {
  getAllPurchaseBills,
  getPurchaseBillByOrganization,
} from "../../services/PurchaseBillService";
import { useAuth } from "../../context/AuthContext";
import PaginationComponent from "../shared/PaginationComponent";
import { getUserById } from "../../services/UserService";
import FilterData from "../shared/FilterData";
import { useNavigate } from "react-router-dom";
import { getPaymentByOrganization } from "../../services/PaymentModeService";
import GetAppOutlinedIcon from "@mui/icons-material/GetAppOutlined";

const exportColumns = [
  { label: "#", key: "index" },
  { label: "Supplier Name", key: "supplierName" },
  { label: "Invoice No.", key: "invoiceNo" },
  { label: "Bill Date", key: "billDate" },
  { label: "Bill Total ", key: "billTotal" },
  { label: "Payment Type", key: "paymentType" },
  { label: "Paid Amount ", key: "paidAmount" },
  { label: "Balance Amount ", key: "balanceAmount" },
  { label: "Payment Mode", key: "paymentMode" },
  { label: "Transaction Number", key: "transactionNumber" },
];

const PurchaseBillReport = () => {
  const { webuser } = useAuth();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [mainUser, setMainUser] = useState();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [gstFilter, setGstFilter] = useState(""); // "" | "gst" | "non-gst"

  const openExportMenu = Boolean(anchorEl);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUserById(webuser?.id);
      setMainUser(user);
    };
    fetchUser();
  }, []);
  useEffect(() => {
    if (mainUser) {
      fetchBills();
    }
  }, [mainUser]);

  const fetchBills = async () => {
    try {
      // const data = await getAllPurchaseBills();
      const data = await getPaymentByOrganization(
        mainUser?.organization_id?._id
      );
      if (data.status === 401) {
        setSnackbarMessage("Your Session is expired. Please login again!");
        setSnackbarOpen(true);
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }

      // const allBills = data.data.docs || [];
      const allBills = data.data || [];
      const filteredBills = allBills.filter(
        (bill) => bill.billType === "purchase"
      );

      setBills(filteredBills);
    } catch (err) {
      console.error("Failed to fetch purchase bills:", err);
      setError("Failed to load purchase bills");
    } finally {
      setLoading(false);
    }
  };

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      if (!bill.createdAt) return false;

      const billDate = new Date(bill.createdAt);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start) start.setHours(0, 0, 0, 0);
      if (end) end.setHours(23, 59, 59, 999);

      const billNumber = (bill.purchasebill?.bill_number || "").toLowerCase();
      const billName = (
        bill.client_id?.first_name ||
        "" + " " + bill.client_id?.last_name ||
        ""
      ).toLowerCase();

      const matchesDateRange =
        (!start || billDate >= start) && (!end || billDate <= end);

      const matchesSearch =
        !searchQuery ||
        billNumber.includes(searchQuery) ||
        billName.includes(searchQuery);
      const matchesGST =
        !gstFilter || bill.purchasebill?.billType === gstFilter;
      return matchesDateRange && matchesSearch && matchesGST;
    });
  }, [bills, startDate, endDate, searchQuery, gstFilter]);

  const getStatementRows = () => {
    const rows = [];
    const grouped = {};

    filteredBills.forEach((entry) => {
      const billId = entry.purchasebill?._id;
      if (!grouped[billId]) grouped[billId] = [];
      grouped[billId].push(entry);
    });

    Object.values(grouped).forEach((entries) => {
      entries.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      const bill = entries[0]?.purchasebill;
      const billTotal = Number(bill?.grandTotal || 0);
      let runningBalance = billTotal;

      entries.forEach((entry) => {
        const paid = Number(entry.amount || 0);
        const prevBalance = runningBalance;
        runningBalance = prevBalance - paid;

        rows.push({
          ...entry,
          amount: paid.toFixed(2),
          previousBalance: prevBalance.toFixed(2),
          newBalance: runningBalance.toFixed(2),
          isOpening: false,
        });
      });
    });

    return rows;
  };

  const mappedBills = useMemo(
    () =>
      getStatementRows().map((bill, index) => ({
        index: index + 1,
        supplierName: `${
          bill.client_id?.first_name ||
          "" + " " + bill.client_id?.last_name ||
          ""
        }`,
        invoiceNo: bill.purchasebill?.bill_number || "",
        billDate: moment(bill.createdAt).format("DD/MM/YYYY") || "",
        billTotal: bill.purchasebill?.grandTotal || 0,
        paymentMode: bill?.paymentType || "",
        paidAmount: bill.amount || 0, // <- this is the paid amount per row
        previousBalance:
          bill.previousBalance || bill.purchasebill?.grandTotal || 0,
        balanceAmount: bill.newBalance || 0,
        paymentType:
          bill.purchasebill?.paymentType === "advance"
            ? "Advance"
            : bill.purchasebill?.paymentType === "full"
            ? "Full"
            : "",
        transactionNumber: bill.upiId || "", // optional: can be added from payment details
      })),
    [filteredBills]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase()); // Case-insensitive search
  };

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const totalBill = filteredBills.reduce(
    (acc, bill) => acc + (bill.purchasebill?.grandTotal || 0),
    0
  );
  const totalPaid = filteredBills.reduce(
    (acc, bill) =>
      acc +
      Number(bill.purchasebill?.advance || 0) +
      Number(bill.purchasebill?.fullPaid || 0),
    0
  );
  const totalbal = filteredBills.reduce(
    (acc, bill) => acc + Number(bill.purchasebill?.balance || 0),
    0
  );

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <Box>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h5" fontWeight={600} mb={2}>
            Purchase Bill Report
          </Typography>
          <FilterData value={searchQuery} onChange={handleSearchChange} />
          <Box display="flex" alignItems="center" gap={2} mb={2} mr={2}>
            <TextField
              label="Start Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              size="small"
              inputProps={{
                min: startDate || moment().format("YYYY-MM-DD"), // Disable dates before start date
              }}
            />
            <TextField
              select
              label="GST Filter"
              value={gstFilter}
              onChange={(e) => setGstFilter(e.target.value)}
              size="small"
              sx={{ minWidth: 120 }}
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="gst">GST</MenuItem>
              <MenuItem value="non-gst">Non-GST</MenuItem>
            </TextField>
             <Button
              variant="outlined"
              // sx={{ ml: 2 }}
              onClick={handleExportClick}
              // endIcon={<MoreVertIcon />}
            >
              <GetAppOutlinedIcon titleAccess="Download As" />
            </Button>
          </Box>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={openExportMenu}
          onClose={handleExportClose}
        >
          <MenuItem
            onClick={() => {
              exportToPDF(
                mappedBills,
                exportColumns,
                `Purchase Summary Report - ${gstFilter.toUpperCase() || "All"}`
              );
              handleExportClose();
            }}
          >
            PDF
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportToExcel(
                mappedBills,
                exportColumns,
                `Purchase Summary Report - ${gstFilter.toUpperCase() || "All"}`
              );
              handleExportClose();
            }}
          >
            Excel
          </MenuItem>
        </Menu>

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
                  <strong>Supplier Name</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Invoice No.</strong>
                </TableCell>
                <TableCell sx={{ background: "#e0e0e0ff" }}>
                  <strong>Bill Date</strong>
                </TableCell>
                <TableCell align="center" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Bill Total (₹)</strong>
                </TableCell>
                <TableCell align="center" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Payment Type</strong>
                </TableCell>
                <TableCell align="center" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Paid Amount (₹)</strong>
                </TableCell>

                <TableCell align="center" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Balance Amount (₹)</strong>
                </TableCell>
                <TableCell align="center" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Payment Mode</strong>
                </TableCell>
                <TableCell align="center" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Transaction Number</strong>
                </TableCell>
                {/* <TableCell align="center" sx={{ background: "#e0e0e0ff" }}>
                  <strong>bill type</strong>
                </TableCell> */}
              </TableRow>
            </TableHead>
            <TableBody>
              {getStatementRows().map((bill, index) => (
                <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    {bill.client_id?.first_name ||
                      "N/A" + " " + bill.client_id?.last_name ||
                      ""}
                  </TableCell>
                  <TableCell>
                    {bill.purchasebill?.bill_number || "N/A"}
                  </TableCell>
                  <TableCell>
                    {bill.createdAt
                      ? moment(bill.createdAt).format("DD/MM/YYYY")
                      : "--"}
                  </TableCell>
                  <TableCell>
                    {bill.purchasebill?.grandTotal?.toFixed(2) || "0.00"}
                  </TableCell>
                  <TableCell align="center">
                    {bill.purchasebill?.paymentType === "advance"
                      ? "Advance"
                      : bill.purchasebill?.paymentType === "full"
                      ? "Full"
                      : "N/A"}
                  </TableCell>
                  <TableCell>
                    {bill.amount === "-"
                      ? "-"
                      : Number(bill.amount || 0).toFixed(2)}
                  </TableCell>

                  <TableCell>{bill.newBalance || "0.00"}</TableCell>
                  <TableCell align="center">
                    {bill.paymentType || "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {/* You'll need to add transaction number logic based on your payment data */}
                    {bill.upiId || "N/A"}
                  </TableCell>
                  {/* <TableCell align="center">
                     {bill.purchasebill?.billType || "N/A"}
                  </TableCell> */}
                </TableRow>
              ))}
              {/* Totals */}
              {/* <TableRow
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
                <TableCell align="center" colSpan={2}>
                  <strong>Total Amount: {totalBill.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="center" colSpan={2}>
                  <strong>Total Paid: {totalPaid.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="center" colSpan={3}>
                  <strong>Balance: {totalbal.toFixed(2)}</strong>
                </TableCell>
              </TableRow> */}
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
    </>
  );
};

export default PurchaseBillReport;
