import api from './api';

export const searchCustomers = async (query) => {
  try {
    const response = await api.get(`/customers/search`, { params: { query } });
    return response.data;
  } catch (error) {
    console.error("Error searching customers:", error);
    throw error;
  }
};
