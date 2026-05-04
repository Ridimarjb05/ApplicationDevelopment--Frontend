// authAPI.js - handles all API calls related to login and registration

import { API_ENDPOINTS } from '../../constants/apiEndpoints';

// login user with email and password
// returns the token and user info if successful
export const loginUser = async (email, password) => {
  const response = await fetch(API_ENDPOINTS.LOGIN, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

// register a new customer account
export const registerUser = async (formData) => {
  const response = await fetch(API_ENDPOINTS.REGISTER, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};
