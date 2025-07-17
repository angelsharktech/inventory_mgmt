import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL }/position/`;

// Fetch all positions
export const getAllPositions = async () => {
  try {
    console.log(API_URL);
    
    const response = await axios.get("http://192.168.1.14:5001/api/position/");    
    return response.data;
  } catch (error) {
    console.error("Error fetching positions:", error);
    throw error;
  }
};
