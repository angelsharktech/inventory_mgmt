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
    const response = await axios.get(`${BASE_URL}/user`);
    return response.data;
  } catch (error) {
     throw error.response?.data || { message: "error geting all users" };
  }
}

export const getUserById = async(id) =>{
  try{
    const response = await axios.get(`${BASE_URL}/user/${id}`)
    return response.data;
  }catch(error) {
    throw error.response?.data || { message: "error geting all users" };
  }
}

export const updateUser = async (id, userData) => {
  try {
    const response = await axios.patch(`${BASE_URL}/user/${id}`, userData ,getAuthHeader()); // adjust path as needed
     return response.data;
  } catch (err) {
    console.error("Error updating user", err);
    return { success: false };
  }
};


