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
    return response.data;
  }
};
export const getAllSaleBills = async()=>{
     try {
    const response = await axios.get(BASE_URL,getAuthHeader());
    return response.data;
  } catch (error) {
    console.error('Error getting sale bill:', error);
    return response.data;
  }
}