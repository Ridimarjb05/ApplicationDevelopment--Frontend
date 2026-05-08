// financialAPI.js - all API calls for Feature 1: Financial Reports
// this file talks to the /api/admin/reports/financial backend endpoints

const BASE_URL = 'http://localhost:5213';

// helper to get the token from local storage
const getHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${localStorage.getItem('token')}`,
});

// get the full financial report
// we can pass from and to dates to filter the results
export const getFinancialReport = async (from = null, to = null) => {
  // build the url with optional date params
  let url = `${BASE_URL}/api/admin/reports/financial`;
  if (from && to) {
    url += `?from=${from}&to=${to}`;
  }

  const res = await fetch(url, { headers: getHeaders() });
  const data = await res.json();
  return { ok: res.ok, data };
};

// get monthly revenue for a specific year
export const getMonthlyRevenue = async (year) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/reports/financial/monthly/${year}`,
    { headers: getHeaders() }
  );
  const data = await res.json();
  return { ok: res.ok, data };
};

// get top selling parts
export const getTopParts = async (count = 5) => {
  const res = await fetch(
    `${BASE_URL}/api/admin/reports/financial/top-parts?count=${count}`,
    { headers: getHeaders() }
  );
  const data = await res.json();
  return { ok: res.ok, data };
};
