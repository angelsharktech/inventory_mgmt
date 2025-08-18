import React from "react";

const QuotationPrint = ({ quotation }) => {
  return (
    <div
      id="printArea"
      style={{
        width: "800px",
        margin: "0 auto",
        padding: "20px",
        border: "2px solid green",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ color: "orange", margin: "0" }}>{quotation?.organization_id?.name}</h2>
          <p>{quotation?.createdBy?.first_name +" "+ quotation?.createdBy?.last_name}</p>
          <p>{quotation?.createdBy?.address}</p>
          <p>{quotation?.createdBy?.phone_number}</p>
          
        </div>
        <div style={{ textAlign: "right" }}>
          <h2 style={{ color: "green", margin: "0" }}>QUOTATION</h2>
          <table style={{ borderCollapse: "collapse", marginTop: "10px" }} border="1" cellPadding="5">
            <tbody>
              <tr>
                <td>Date</td>
                <td>{new Date(quotation.createdAt).toLocaleDateString()}</td>
              </tr>
              <tr>
                <td>Quote #</td>
                <td>{quotation.quotationNo}</td>
              </tr>
              {/* <tr>
                <td>Customer ID</td>
                <td>{quotation.customer.phone}</td>
              </tr>
              <tr>
                <td>Valid Until</td>
                <td>{new Date(quotation.date).toLocaleDateString()}</td>
              </tr> */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Customer */}
      <h3 style={{ background: "green", color: "white", padding: "5px" }}>CUSTOMER</h3>
      <div style={{ padding: "10px" }}>
        <p>NAME : {quotation.customer.name}</p>
        <p>ADDRESS: {quotation.customer.address || "-"}</p>
        <p>CONTACT NO.: {quotation.customer.phone}</p>
      </div>

      {/* Description */}
      <h3 style={{ background: "green", color: "white", padding: "5px" }}>DESCRIPTION</h3>
      <table
        width="100%"
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", marginBottom: "20px" }}
      >
        <thead style={{ background: "#f5f5f5" }}>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Unit Price</th>
            <th>Tax %</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {quotation.products.map((p, i) => (
            <tr key={i}>
              <td>{p.productName}</td>
              <td>{p.quantity}</td>
              <td>{p.unitPrice}</td>
              <td>{p.tax}</td>
              <td>{p.total.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Terms and Totals */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
       
        {/* <div style={{ width: "60%" }}>
          <h3 style={{ background: "green", color: "white", padding: "5px" }}>TERMS AND CONDITIONS</h3>
          <div style={{ padding: "10px", fontSize: "14px" }}>
            <p>1. Customer will be billed after indicating acceptance of this quote</p>
            <p>2. Payment will be due prior to delivery of service and goods</p>
            <p>3. Please fax or mail the signed price quote to the address above</p>
          </div>
        </div> */}

            <p style={{ marginTop: "30px" }}>
              Customer Acceptance (sign below):
              <br />
              X _____________________________
              <br />
              Print Name:
            </p>

        {/* Totals */}
        <div style={{ width: "35%", border: "1px solid #ccc" }}>
          <table width="100%" cellPadding="8" style={{ borderCollapse: "collapse" }}>
            <tbody>
              <tr>
                <td>Subtotal</td>
                <td style={{ textAlign: "right" }}>{quotation.subtotal}</td>
              </tr>
              <tr>
                <td>Taxable</td>
                <td style={{ textAlign: "right" }}>{quotation.subtotal}</td>
              </tr>
              <tr>
                <td>Tax Value</td>
                <td style={{ textAlign: "right" }}>{quotation.taxTotal}</td>
              </tr>
              <tr>
                <td>Other</td>
                <td style={{ textAlign: "right" }}>-</td>
              </tr>
              <tr style={{ background: "orange", fontWeight: "bold" }}>
                <td>Total</td>
                <td style={{ textAlign: "right" }}>₹ {quotation.grandTotal}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <p style={{ textAlign: "center", marginTop: "20px", fontStyle: "italic" }}>
        Thank You For Your Business!
      </p>
    </div>
  );
};

export default QuotationPrint;
