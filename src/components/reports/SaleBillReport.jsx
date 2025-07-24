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

const exportColumns = [
  { label: "#", key: "index" },
  { label: "Customer Name", key: "customerName" },
  { label: "Invoice No.", key: "invoiceNo" },
  { label: "Bill Date", key: "billDate" },
  { label: "Bill Total ", key: "billTotal" },
  { label: "Payment Type", key: "paymentType" },
  { label: "Paid Amount ", key: "paidAmount" },
  { label: "Balance Amount ", key: "balanceAmount" },
  { label: "Payment Mode", key: "paymentMode" },
  { label: "Transaction Number", key: "transactionNumber" },
];

// Replace this with your actual API call
const getAllSaleBills = async () => {
  return [
    {
      biller: {
        first_name: "Overseas Tax",
        address: "Some address",
        phone_number: "1234567890",
      },
      billDate: "2020-08-04",
      dueDate: "2020-08-19",
      totals: { grandTotal: 3770 },
      paymentType: "full Paid",
      paymentDetails: { advance: 0, balance: 0, full: 3770, mode1: "cash" },
    },
    {
      biller: { first_name: "SEZ Tax Intra" },
      billDate: "2020-08-04",
      dueDate: "2020-08-19",
      totals: { grandTotal: 3850 },
      paymentType: "full Paid",
      paymentDetails: {
        advance: 0,
        balance: 0,
        full: 3850,
        mode1: "upi",
        transactionNumber: "1569845",
      },
    },
    {
      biller: { first_name: "SEZ Tax Inter" },
      billDate: "2020-07-24",
      dueDate: "2020-07-31",
      totals: { grandTotal: 980 },
      paymentType: "advance",
      paymentDetails: {
        advance: 500,
        balance: 480,
        mode1: "upi",
        transactionNumber: "1569845",
      },
    },
    {
      biller: { first_name: "SEZ Tax Inter" },
      billDate: "2020-07-24",
      dueDate: "2020-07-31",
      totals: { grandTotal: 980 },
      paymentType: "advance",
      paymentDetails: {
        advance: 500,
        balance: 480,
        mode1: "upi",
        transactionNumber: "1569845",
      },
    },
    {
      biller: { first_name: "SEZ Tax Inter" },
      billDate: "2020-07-24",
      dueDate: "2020-07-31",
      totals: { grandTotal: 980 },
      paymentType: "advance",
      paymentDetails: {
        advance: 500,
        balance: 480,
        mode1: "upi",
        transactionNumber: "1569845",
      },
    },
    {
      biller: { first_name: "SEZ Tax Inter" },
      billDate: "2020-07-24",
      dueDate: "2020-07-31",
      totals: { grandTotal: 980 },
      paymentType: "advance",
      paymentDetails: {
        advance: 500,
        balance: 480,
        mode1: "upi",
        transactionNumber: "1569845",
      },
    },
    {
      biller: { first_name: "SEZ Tax Inter" },
      billDate: "2020-07-24",
      dueDate: "2020-07-31",
      totals: { grandTotal: 980 },
      paymentType: "advance",
      paymentDetails: {
        advance: 500,
        balance: 480,
        mode1: "upi",
        transactionNumber: "1569845",
      },
    },
    {
      biller: { first_name: "SEZ Tax Inter" },
      billDate: "2020-07-24",
      dueDate: "2020-07-31",
      totals: { grandTotal: 980 },
      paymentType: "advance",
      paymentDetails: {
        advance: 500,
        balance: 480,
        mode1: "upi",
        transactionNumber: "1569845",
      },
    },
    // Add more bills as needed
  ];
};

const SaleBillReport = () => {
  const [bills, setBills] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const openExportMenu = Boolean(anchorEl);

  useEffect(() => {
    getAllSaleBills().then((data) => {
      setBills(data);
    });
  }, []);
  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      if (!bill.billDate) return false;
      const billDate = new Date(bill.billDate);
      const start = startDate ? new Date(startDate) : null;
      const end = endDate ? new Date(endDate) : null;

      if (start && billDate < start) return false;
      if (end && billDate > end) return false;
      return true;
    });
  }, [bills, startDate, endDate]);

  const mappedBills = useMemo(() =>
  filteredBills.map((bill, index) => ({
    index: index + 1,
    customerName: `${bill.biller?.first_name || ""}`,
    invoiceNo: bill.invoiceNo || "",
    billDate: bill.billDate || "",
    billTotal: bill.totals?.grandTotal || 0,
    paymentType: bill.paymentType || "",
    paidAmount:
      Number(bill.paymentDetails?.advance || 0) +
      Number(bill.paymentDetails?.full || 0),
    balanceAmount: bill.paymentDetails?.balance,
    paymentMode: [bill.paymentDetails?.mode1, bill.paymentDetails?.mode2]
      .filter(Boolean)
      .join(" / "),
    transactionNumber: [
      bill.paymentDetails?.transactionNumber,
      bill.paymentDetails?.transactionNumber2,
    ]
      .filter(Boolean)
      .join(" / "),
  })), [filteredBills]);

  const handleExportClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleExportClose = () => {
    setAnchorEl(null);
  };

  const totalBill = filteredBills.reduce(
    (acc, bill) => acc + (bill.totals?.grandTotal || 0),
    0
  );
  const totalPaid = filteredBills.reduce(
    (acc, bill) =>
      acc +
      Number(bill.paymentDetails?.advance || 0) +
      Number(bill.paymentDetails?.full || 0),
    0
  );
  const totalbal = filteredBills.reduce(
    (acc, bill) => acc + Number(bill.paymentDetails?.balance || 0),
    0
  );

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
            Sale Bill Summary
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
              exportToPDF(mappedBills, exportColumns, "Sale Summary Report");
              handleExportClose();
            }}
          >
            PDF
          </MenuItem>
          <MenuItem
            onClick={() => {
              exportToExcel(mappedBills, exportColumns, "Sale Summary Report");
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
                  <strong>Customer Name</strong>
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
                  <TableCell>{bill.biller?.first_name || "N/A"}</TableCell>
                  <TableCell>{10 - index}</TableCell>
                  <TableCell>{bill.billDate || "--"}</TableCell>
                  <TableCell align="center">
                    {bill.totals?.grandTotal.toFixed(2)}
                  </TableCell>
                  <TableCell align="center">{bill.paymentType}</TableCell>
                  <TableCell align="center">
                    {Number(
                      bill.paymentDetails?.advance || bill.paymentDetails.full
                    ).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    {Number(bill.paymentDetails?.balance || 0).toFixed(2)}
                  </TableCell>
                  <TableCell align="center">
                    {bill.paymentDetails?.mode1}
                  </TableCell>
                  <TableCell align="center">
                    {bill.paymentDetails?.transactionNumber}
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
                <TableCell colSpan={8}>
                  <strong>Total : {totalBill.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right" width={150}>
                  <strong>Total Paid : {totalPaid.toFixed(2)}</strong>
                </TableCell>
                <TableCell align="right" width={150}>
                  <strong>Balance : {totalbal.toFixed(2)}</strong>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </>
  );
};

export default SaleBillReport;
