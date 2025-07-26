import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL }/paymentMode/`;

export const addPayment = async (data) => {
  try {
    const response = await axios.post(API_URL ,data);
    return response.data;
  } catch (error) {
    console.error("Error adding Payment :", error);
    throw error;
  }
};