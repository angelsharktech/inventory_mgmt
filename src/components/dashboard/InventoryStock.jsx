import React from "react";
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    IconButton,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PrintIcon from "@mui/icons-material/Print";
import AddIcon from "@mui/icons-material/Add";
import StoreIcon from "@mui/icons-material/Store";
import DescriptionIcon from "@mui/icons-material/Description";

// Sample invoice data
const products = [
    { id: 1, customer: "abc", date: "22 Aug 2025", amount: 2585 },
    { id: 2, customer: "Shredhar", date: "22 Aug 2025", amount: 500 },
    { id: 3, customer: "Shinde", date: "22 Aug 2025", amount: 681.6 },
];

const InventoryStock = () => {
    return (
        <Box display="flex" gap={3} flexWrap="wrap">
            {/* Left: Recent Invoices */}
            <Box flex={3}>
                <Paper sx={{ p: 3, borderRadius: 3, boxShadow: 4 }}>
                    <Box display="flex" justifyContent="space-between" mb={2}>
                        <Typography variant="h6" fontWeight="600">
                            Recent Products
                        </Typography>
                        <Button variant="contained" sx={{
                            background: "linear-gradient(135deg, #182848, #324b84ff)",
                            color: "#fff",
                        }} startIcon={<AddIcon />}>
                            New Products
                        </Button>
                    </Box>

                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: "#f0f4f8" }}>
                                <TableCell>Products</TableCell>
                                <TableCell>Suppiler</TableCell>
                                <TableCell>DATE</TableCell>
                                <TableCell>AMOUNT</TableCell>
                                <TableCell>ACTION</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((inv) => (
                                <TableRow key={inv.id} hover>
                                    <TableCell><b>{inv.id}</b></TableCell>
                                    <TableCell>{inv.customer}</TableCell>
                                    <TableCell>{inv.date}</TableCell>
                                    <TableCell>₹ {inv.amount.toLocaleString()}</TableCell>
                                    <TableCell>
                                        <IconButton color="primary">
                                            <VisibilityIcon />
                                        </IconButton>
                                        <IconButton color="secondary">
                                            <PrintIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    <Button variant="contained" sx={{
                        background: "linear-gradient(135deg, #182848, #324b84ff)",
                        color: "#fff",
                    }} >
                        View All Products
                    </Button>
                </Paper>
            </Box>

            {/* Right: Quick Actions + Today's Summary */}
            <Box flex={1} display="flex" flexDirection="column" gap={2}>
                {/* Quick Actions */}
                <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" mb={2}>
                        ⚡ Quick Actions
                    </Typography>
                    <Button
                        variant="contained"
                        fullWidth
                        startIcon={<AddIcon />}
                        sx={{
                            mb: 1
                            , background: "linear-gradient(135deg, #182848, #324b84ff)",
                            color: "#fff",
                        }}
                    >
                        Add category
                    </Button>
                    <Button
                        fullWidth
                        startIcon={<StoreIcon />}
                        sx={{
                            mb: 1,
                            color: "#182848",
                        }}
                    >
                        Update Shop
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        // startIcon={<AddIcon />}
                        sx={{
                            mb: 1
                            , background: "linear-gradient(135deg, #182848, #324b84ff)",
                            color: "#fff",
                        }}
                    >
                         + Stock In
                    </Button>
                    <Button
                        variant="contained"
                        fullWidth
                        // startIcon={<AddIcon />}
                        sx={{
                            mb: 1
                            , background: "linear-gradient(135deg, #182848, #324b84ff)",
                            color: "#fff",
                        }}
                    >
                       - Stock Out
                    </Button>
                </Paper>

                {/* Today's Summary */}
                <Paper sx={{ p: 2, borderRadius: 3, boxShadow: 4 }}>
                    <Typography variant="subtitle1" fontWeight="600" mb={2}>
                        📊 Today's Summary
                    </Typography>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Typography>Total Products</Typography>
                        <Typography>10</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                        <Typography>Total Stock</Typography>
                        <Typography>10</Typography>
                    </Box>
                </Paper>
            </Box>
        </Box>
    );
};




export default InventoryStock;
