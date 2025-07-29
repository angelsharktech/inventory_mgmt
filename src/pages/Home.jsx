import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, styled } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import StoreIcon from "@mui/icons-material/Store";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllUser, getUserById, getUserByOrganizastionId } from "../services/UserService";
import { getAllProducts } from "../services/ProductService";
import { getSaleBillByOrganization } from "../services/SaleBillService";
import { getPurchaseBillByOrganization } from "../services/PurchaseBillService";
import { useAuth } from "../context/AuthContext";
import { getAllRoles } from '../services/Role';

const Item = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: "center",
  color: theme.palette.text.secondary,
  borderRadius: 10,
  boxShadow: theme.shadows[3],
}));

const StatCard = ({ title, value, icon, color }) => (
  <Item sx={{ backgroundColor: color, color: "white" }}>
    <Box display="flex" alignItems="center" justifyContent="space-between">
      <Box sx={{ width: "120px", height: "100px" }}>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="h4">{value}</Typography>
      </Box>
      {icon}
    </Box>
  </Item>
);

const Home = () => {
  const { webuser } = useAuth();
  const [counts, setCounts] = useState({
    vendors: 0,
    customers: 0,
    products: 0,
    saleBills: 0,
    purchaseBills: 0,
  });
const [chartData, setChartData] = useState([]);

  useEffect(() => {
      
      const fetchCounts = async () => {

          const user = await getUserById(webuser.id)
        const users = await getUserByOrganizastionId(user.organization_id._id);
        const roles = await getAllRoles();
  
        const vendorRole = roles.find((r) => r.name.toLowerCase() === "vendor");
        const customerRole = roles.find((r) => r.name.toLowerCase() === "customer");
        
        const vendors = users?.filter(
          u => u.role_id?._id === vendorRole?._id &&
               u.status === "active"
        ) || [];
        
        const customers = users?.filter(
          u => u.role_id?._id === customerRole?._id &&
               u.status === "active" 
        ) || [];
        
        setCounts({
          vendors: vendors.length,
          customers: customers.length,       
        });
      };
    fetchCounts();
  }, [webuser]);


useEffect(() => {
  const fetchCountsAndChartData = async () => {
    const user = await getUserById(webuser.id)
    let saleBills = await getSaleBillByOrganization(user.organization_id._id);
    let purchaseBills = await getPurchaseBillByOrganization(user.organization_id._id);

    // Aggregate by month
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    const saleByMonth = Array(12).fill(0);
    const purchaseByMonth = Array(12).fill(0);

const currentYear = new Date().getFullYear();

saleBills?.data?.docs?.forEach(bill => {
  const date = new Date(bill.createdAt);
  if (date.getFullYear() === currentYear) {
    const month = date.getMonth(); // 0 = Jan
    saleByMonth[month] += bill.grandTotal || 0;
  }
});

purchaseBills?.data?.docs?.forEach(bill => {
  const date = new Date(bill.createdAt);
  if (date.getFullYear() === currentYear) {
    const month = date.getMonth();
    purchaseByMonth[month] += bill.grandTotal || 0;
  }
});
    // Build chartData for current year
    const chartData = months.map((name, i) => ({
      name,
      Sale: saleByMonth[i],
      Purchase: purchaseByMonth[i]
    }));

    setChartData(chartData); // use useState for chartData
  };

  fetchCountsAndChartData();
}, [webuser]);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Organization Overview
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Vendors"
            value={counts.vendors}
            icon={<StoreIcon sx={{ fontSize: 50 }} />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Customers"
            value={counts.customers}
            icon={<PeopleIcon sx={{ fontSize: 50 }} />}
            color="#388e3c"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={2.4}>
          <StatCard
            title="Products"
            value={123}
            icon={<Inventory2Icon sx={{ fontSize: 50 }} />}
            color="#fbc02d"
          />
        </Grid>
        
       
      </Grid>

      {/* Bar Charts Section */}
      <Grid container spacing={30} >
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 ,width:'175%' }}>
            <Typography variant="h6" gutterBottom>
              Sale Overview
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={chartData}
                barCategoryGap="10%"
                barSize={30}
              >
                <defs>
                  <linearGradient
                    id="blueGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#3477eb" />
                    <stop offset="100%" stopColor="#25f5ee" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Sale" fill="url(#blueGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, borderRadius: 2 ,width:'175%'}}>
            <Typography variant="h6" gutterBottom>
              Purchase Overview
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={chartData}
                barCategoryGap="10%"
                barSize={30}
              >
                <defs>
                  <linearGradient
                    id="yellowGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#f5f125" />
                    <stop offset="100%" stopColor="#9ff01d" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Purchase" fill="url(#yellowGradient)" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Home;