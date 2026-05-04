// staffAPI.js - all API calls for Feature 2: Staff Management
// this file talks to the /api/admin/staff backend endpoints

import { API_ENDPOINTS } from '../../constants/apiEndpoints';
import { get, post, put, del } from '../../services/api';

// get all staff members from the backend
export const getAllStaff = async () => {
  return await get(API_ENDPOINTS.STAFF_ALL);
};

// get one staff member by their ID
export const getStaffById = async (id) => {
  return await get(API_ENDPOINTS.STAFF_BY_ID(id));
};

// create a new staff member
// expects: { firstName, lastName, email, phone, position, password, address, hireDate }
export const createStaff = async (staffData) => {
  return await post(API_ENDPOINTS.STAFF_ALL, staffData);
};

// update an existing staff member
// expects: { firstName, lastName, phone, position, status }
export const updateStaff = async (id, staffData) => {
  return await put(API_ENDPOINTS.STAFF_BY_ID(id), staffData);
};

// delete a staff member by ID
export const deleteStaff = async (id) => {
  return await del(API_ENDPOINTS.STAFF_BY_ID(id));
};
