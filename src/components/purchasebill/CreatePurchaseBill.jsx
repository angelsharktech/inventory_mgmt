import React, { useEffect, useState } from "react";
import { Box, Snackbar, Alert } from "@mui/material";
import GenerateBill from "../shared/GenerateBill";
import PurchaseBillForm from "./PurchaseBillForm";

const CreatePurchaseBill = () => {
  const [showPrint, setShowPrint] = useState(false);
  const [printData, setPrintData] = useState();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
 

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
        <PurchaseBillForm
          setShowPrint={setShowPrint}
          setPrintData={setPrintData}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMessage={setSnackbarMessage}
          // setInvoiceNumber={newInvoiceNumber}
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

export default CreatePurchaseBill;
