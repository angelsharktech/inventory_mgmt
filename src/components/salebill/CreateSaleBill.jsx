import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import SaleBillForm from "./SaleBillForm";
import GenerateBill from "../shared/GenerateBill";
import { getAllSaleBills } from "../../services/SaleBillService";
import { generateNextInvoiceNumber } from "../shared/InvoiceGeneration";

const CreateSaleBill = () => {
  const [showPrint, setShowPrint] = useState(false);
  const [printData, setPrintData] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");


const [lastInvoiceNumber, setLastInvoiceNumber] = useState('');
const [newInvoiceNumber, setNewInvoiceNumber] = useState('');

// Fetch all bills and set the last invoice number
useEffect(() => {
  const fetchLastInvoice = async () => {
    try {
      const response = await getAllSaleBills(); // Your existing API call
      console.log(response);
      
      if (response.success && response.data.docs.length > 0) {
        // Sort bills by creation date (newest first)
        const sortedBills = response.data.docs.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        console.log('88888888',sortedBills);
        
        const lastBill = sortedBills[0];
        console.log(lastBill);
        
        setLastInvoiceNumber(lastBill.bill_number);
      }
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    }
  };
  fetchLastInvoice();
  console.log('lastInvoiceNumber:',lastInvoiceNumber);
  
  const newInvoiceNumber = generateNextInvoiceNumber(lastInvoiceNumber);
  setNewInvoiceNumber(newInvoiceNumber)
}, []);
   console.log(newInvoiceNumber);
   
  return (
    <>
      <Box
        sx={{
          maxHeight: "calc(100vh - 100px)",
          overflowY: "auto",
          p: 3,
          bgcolor: "#f9f9f9",
          borderRadius: 2,
          boxShadow: 2,
        }}
      >
        <SaleBillForm
          setShowPrint={setShowPrint}
          setPrintData={setPrintData}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          setInvoiceNumber={newInvoiceNumber}
        />
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity={
            snackbarMessage === "Sale bill created successfully!"
              ? "success"
              : "error"
          }
          onClose={() => setSnackbarOpen(false)}
          variant="filled"
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {showPrint && printData && (
        <div className="print-only">
          <GenerateBill bill={printData} billName={"SALE"} />
        </div>
      )}
    </>
  );
};

export default CreateSaleBill;