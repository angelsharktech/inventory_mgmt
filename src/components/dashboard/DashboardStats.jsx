import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
import CategoryIcon from "@mui/icons-material/Category";       
import Inventory2Icon from "@mui/icons-material/Inventory2";  
import StoreIcon from "@mui/icons-material/Store";               
import PeopleIcon from "@mui/icons-material/People";            
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; 


const DashboardStats = () => {
    // ✅ Static data (you can change values as needed)
    const stats = [
        {
            title: "Categories",
            value: 12,
            icon: <CategoryIcon fontSize="large" color="success" />,
        },
        {
            title: "Products",
            value: 45,
            icon: <Inventory2Icon fontSize="large" color="warning" />,
        },
        {
            title: "Vendors",
            value: 20,
            icon: <StoreIcon fontSize="large" color="primary" />,
        },
        // {
        //     title: "Customers",
        //     value: 60,
        //     icon: <PeopleIcon fontSize="large" color="secondary" />,
        // },
        // {
        //     title: "Total Fee",
        //     value: "₹ 5,20,000",
        //     icon: <AccountBalanceWalletIcon fontSize="large" color="success" />,
        // },
        // {
        //     title: "Pending Fee",
        //     value: "₹ 1,15,000",
        //     icon: <ReceiptLongIcon fontSize="large" color="error" />,
        // },
    ];


    return (
        <Grid container spacing={3}>
            {stats.map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                    <Card
                        sx={{
                            borderRadius: "16px",
                            boxShadow: "0px 4px 12px rgba(0,0,0,0.1)",
                            transition: "transform 0.2s ease-in-out",
                            "&:hover": { transform: "translateY(-5px)" },
                        }}
                    >
                        <CardContent sx={{ textAlign: "center", width: 300 }}>
                            {stat.icon}
                            <Typography fontWeight="bold" sx={{ mt: 1 }}>
                                {stat.title}
                            </Typography>
                            <Typography variant="h5" color="text.secondary">
                                {stat.value}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
};

export default DashboardStats;
