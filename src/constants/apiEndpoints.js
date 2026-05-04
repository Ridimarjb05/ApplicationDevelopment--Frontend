// all backend API endpoint URLs are stored here
// so if the URL changes we only update it in one place

const BASE_URL = 'http://localhost:5213';

export const API_ENDPOINTS = {
  // auth endpoints
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register-customer`,

  // staff management endpoints (Feature 2)
  STAFF_ALL: `${BASE_URL}/api/admin/staff`,
  STAFF_BY_ID: (id) => `${BASE_URL}/api/admin/staff/${id}`,

  // parts inventory endpoints (Feature 3)
  PARTS_ALL: `${BASE_URL}/api/admin/parts`,
  PARTS_BY_ID: (id) => `${BASE_URL}/api/admin/parts/${id}`,
  PARTS_STOCK_IN: (id) => `${BASE_URL}/api/admin/parts/${id}/stock-in`,
};
