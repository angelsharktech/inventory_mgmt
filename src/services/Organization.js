import axios from 'axios';

const API_URL = `${import.meta.env.VITE_EXT_API }/api/organization/`;

// Fetch all Organization
export const getAllOrganization = async () => {
  try {
    console.log(API_URL);
    
    const response = await axios.get(API_URL);    
    return response.data;
  } catch (error) {
    console.error("Error fetching organizations:", error);
    throw error;
  }
};
