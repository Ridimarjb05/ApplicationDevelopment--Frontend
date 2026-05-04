// partsAPI.js - all API calls for Feature 3: Parts Inventory
// this file talks to the /api/admin/parts backend endpoints

import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { get, post, put, del } from '../../services/api';

// get all parts from the backend
export const getAllParts = async () => {
  return await get(API_ENDPOINTS.PARTS_ALL);
};

// get one part by its ID
export const getPartById = async (id) => {
  return await get(API_ENDPOINTS.PARTS_BY_ID(id));
};

// create a new part
// expects: { vendorID, name, description, category, partNumber, price, stock, lowStockThreshold }
export const createPart = async (partData) => {
  return await post(API_ENDPOINTS.PARTS_ALL, partData);
};

// update an existing part
// expects: { name, category, price, description }
export const updatePart = async (id, partData) => {
  return await put(API_ENDPOINTS.PARTS_BY_ID(id), partData);
};

// delete a part by ID
export const deletePart = async (id) => {
  return await del(API_ENDPOINTS.PARTS_BY_ID(id));
};

// add more stock to an existing part
export const stockIn = async (id, quantity) => {
  return await post(API_ENDPOINTS.PARTS_STOCK_IN(id), { quantity });
};
