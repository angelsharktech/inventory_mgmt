import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api";
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};
// Register user
export const registerUser = async (userData) => {
  try {
    console.log('userData reg ::',userData);
    
    const response = await axios.post(`${BASE_URL}/auth/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration failed:", error);
    throw error.response?.data || { message: "Registration error" };
  }
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, credentials);
    return response.data;
  } catch (error) {
    // console.error("Login failed:", error);
    throw error.response?.data || { message: "Login error" };
  }
};

//All User
export const getAllUser = async() =>{
  try {
    const response = await axios.get(`${BASE_URL}/user` ,getAuthHeader());
    return response.data;
  } catch (error) {
     throw error.response?.data || { message: "error geting all users" };
  }
}