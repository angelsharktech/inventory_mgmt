import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

// Styled components
const CircularProgressContainer = styled(Box)({
  position: "relative",
  width: 200,
  height: 200,
  margin: "0 auto",
});

const CircleBackground = styled("circle")({
  fill: "none",
  stroke: "#e0e0e0",
  strokeWidth: 10,
});

const ProgressCircle = styled("circle")({
  fill: "none",
  strokeLinecap: "round",
  transform: "rotate(-90deg)",
  transformOrigin: "50% 50%",
  transition: "stroke-dashoffset 0.5s ease-in-out",
});

const CenterText = styled(Box)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  textAlign: "center",
});

const LegendContainer = styled(Box)({
  display: "flex",
  flexDirection: "column",
  gap: "8px",
  marginTop: "24px",
});

const LegendItem = styled(Box)({
  display: "flex",
  alignItems: "center",
});

const LegendColor = styled(Box)({
  width: 16,
  height: 16,
  borderRadius: "50%",
  marginRight: 8,
});

const InventoryCircle = () => {
  const theme = useTheme();

  // ✅ Static Fee Data
  const [feeData] = useState({
    totalFee: 100000,
    feeReceived: 60000,
    pendingFee: 25000,
  });

  // Calculate values
  const receivedAmount = feeData.feeReceived;
  const pendingAmount = feeData.pendingFee;
  const remainingAmount = Math.max(
    0,
    feeData.totalFee - receivedAmount - pendingAmount
  );

  const calculatePercentage = (value) =>
    feeData.totalFee > 0 ? (value / feeData.totalFee) * 100 : 0;

  const receivedPercent = calculatePercentage(receivedAmount);
  const pendingPercent = calculatePercentage(pendingAmount);

  // Circle configuration
  const radius = 90;
  const circumference = 2 * Math.PI * radius;

  const getDashArray = (percent) =>
    `${(percent / 100) * circumference} ${circumference}`;

  // Colors
  const colors = {
    received: theme.palette.success.main,
    pending: theme.palette.warning.main,
    remaining: theme.palette.error.main,
  };

  return (
    <Box sx={{ p: 3, textAlign: "center" }}>
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
         Fee Status Overview
      </Typography>

      <CircularProgressContainer>
        <svg width="100%" height="100%" viewBox="0 0 200 200">
          <CircleBackground cx="100" cy="100" r={radius} />

          {/* Received */}
          <ProgressCircle
            cx="100"
            cy="100"
            r={radius}
            stroke={colors.received}
            strokeWidth="10"
            strokeDasharray={getDashArray(receivedPercent)}
            strokeDashoffset="0"
          />

          {/* Pending */}
          <ProgressCircle
            cx="100"
            cy="100"
            r={radius}
            stroke={colors.pending}
            strokeWidth="10"
            strokeDasharray={getDashArray(pendingPercent)}
            strokeDashoffset={-((receivedPercent / 100) * circumference)}
          />
        </svg>

        <CenterText>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            ₹{feeData.totalFee.toLocaleString()}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Total  Fees
          </Typography>
        </CenterText>
      </CircularProgressContainer>

      <LegendContainer>
        <LegendItem>
          <LegendColor sx={{ backgroundColor: colors.received }} />
          <Typography variant="body2">
            Received: ₹{receivedAmount.toLocaleString()} (
            {Math.round(receivedPercent)}%)
          </Typography>
        </LegendItem>
        <LegendItem>
          <LegendColor sx={{ backgroundColor: colors.pending }} />
          <Typography variant="body2">
            Pending: ₹{pendingAmount.toLocaleString()} (
            {Math.round(pendingPercent)}%)
          </Typography>
        </LegendItem>
        <LegendItem>
          <LegendColor sx={{ backgroundColor: colors.remaining }} />
          <Typography variant="body2">
            Remaining: ₹{remainingAmount.toLocaleString()}
          </Typography>
        </LegendItem>
      </LegendContainer>
    </Box>
  );
};

export default InventoryCircle;
