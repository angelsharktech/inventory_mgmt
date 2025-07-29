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
  MenuItem,
  Menu,
  Box,
  TextField,
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

const exportColumns = [
  { label: "#", key: "index" },
  { label: "Vendor Name", key: "vendorName" },
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
  const [mainUser, setMainUser] = useState();
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);

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
      fetchBills(currentPage);
    }
  }, [currentPage, mainUser]);

  const fetchBills = async (page = 1) => {
    try {
      // const data = await getAllPurchaseBills();
      const data = await getPurchaseBillByOrganization(mainUser?.organization_id?._id,page);
      const allBills = data.data.docs || [];
      console.log(allBills);

      setBills(allBills);
      setTotalPages(data.data.totalPages || 1);
      setCurrentPage(data.data.page || page);
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

      if (start && billDate < start) return false;
      if (end && billDate > end) return false;
      return true;
    });
  }, [bills, startDate, endDate]);

  console.log("BILLS:", bills);
  console.log("FILTERED BILLS:", filteredBills);

  const mappedBills = useMemo(
    () =>
      filteredBills.map((bill, index) => ({
        index: index + 1,
        vendorName: `${bill.bill_to?.first_name || ""}`,
        invoiceNo: bill.bill_number || "",
        billDate: bill.createdAt || "",
        billTotal: bill.grandTotal || 0,
        paymentType: bill.paymentType || "",
        paidAmount: Number(bill.advance || 0) + Number(bill.fullPaid || 0),
        balanceAmount: bill.balance || 0,
        paymentMode:
          bill.paymentType === "advance"
            ? "Advance"
            : bill.paymentType === "full"
            ? "Full"
            : "",
        transactionNumber: "", // You'll need to add transaction data from payment details if available
      })),
    [filteredBills]
  );

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

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
          <Typography variant="h5" fontWeight={600}>
            Purchase Bill Report
          </Typography>
          <Box display="flex" alignItems="center" gap={2} mb={2} mr={4}>
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

            <Button
              variant="outlined"
              sx={{ ml: 2 }}
              onClick={handleExportClick}
              endIcon={<MoreVertIcon />}
            >
              Export As
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
                "Purchase Summary Report"
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
                "Purchase Summary Report"
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
            maxHeight: 600,
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
                <TableCell align="right" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Payment Mode</strong>
                </TableCell>
                <TableCell align="right" sx={{ background: "#e0e0e0ff" }}>
                  <strong>Transaction Number</strong>
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
                  <TableCell align="center">
                    {bill.paymentType === "advance"
                      ? "Advance"
                      : bill.paymentType === "full"
                      ? "Full"
                      : "N/A"}
                  </TableCell>
                  <TableCell align="center">
                    {/* You'll need to add transaction number logic based on your payment data */}
                    {bill.referenceId || "N/A"}
                  </TableCell>
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

      <PaginationComponent
        totalPages={totalPages}
        currentPage={currentPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default PurchaseBillReport;
