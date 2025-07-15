import React, { useEffect, useRef } from "react";
import JsBarcode from "jsbarcode";

const BarcodePrinter = ({ product }) => {
  const printRef = useRef();

  useEffect(() => {
    if (!product) return;

    const svg = printRef.current.querySelector("svg");

    JsBarcode(svg, product?.sku || "DEFAULT123", {
      format: "CODE128",
      lineColor: "#000",
      width: 2,
      height: 50,
      displayValue: true,
    });

    // Wait for barcode to render, then print
    setTimeout(() => {
      window.print();
    }, 300);
  }, [product]);

  return (
    <div
      ref={printRef}
      id="printable-barcode"
      className="barcode-print"
      aria-hidden="true"
    >
      <h4 style={{ margin: 0 }}>{product?.name}</h4>
      <svg></svg>
    </div>
  );
};

export default BarcodePrinter;
