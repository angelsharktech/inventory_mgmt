import axios from "axios";

const BASE_URL = `${import.meta.env.VITE_API_BASE_URL }/salebills/`  ;
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const addSaleBill = async (billData) => {
  try {
    const response = await axios.post(BASE_URL, billData,getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error adding sale bill:', error);
    return error;
  }
};
export const getAllSaleBills = async(page = 1, limit = 10)=>{
     try {
    const response = await axios.get(`${BASE_URL}?page=${page}&limit=${limit}`,getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting sale bill:', error);
    return response.data;
  }
}
export const getSaleBillById = async(id)=>{
     try {
    const response = await axios.get(`${BASE_URL}${id}`,getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting sale bill:', error);
    return error;
  }
}
export const updateSaleBill = async (id, data) => {
  try {
    const response = await axios.put(`${BASE_URL}${id}`, data,getAuthHeader());
    return response.data;
  } catch (error) {
    console.error("Error updating sale bill:", error);
    return error;
  }
};