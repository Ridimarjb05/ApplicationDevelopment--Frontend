// apiEndpoints.js - all backend API URLs in one place
// this makes it easy to change the backend URL in one file

const BASE_URL = 'http://localhost:5213';

export const API_ENDPOINTS = {
  // auth endpoints
  LOGIN: `${BASE_URL}/api/auth/login`,
  REGISTER: `${BASE_URL}/api/auth/register`,

  // financial report endpoints (Feature 1)
  FINANCIAL_REPORT: `${BASE_URL}/api/admin/reports/financial`,
  MONTHLY_REVENUE: (year) => `${BASE_URL}/api/admin/reports/financial/monthly/${year}`,
  TOP_PARTS: (count) => `${BASE_URL}/api/admin/reports/financial/top-parts?count=${count}`,

  // staff endpoints (Feature 2)
  STAFF: `${BASE_URL}/api/admin/staff`,

  // parts endpoints (Feature 3)
  PARTS: `${BASE_URL}/api/admin/parts`,
};
