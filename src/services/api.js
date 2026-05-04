// this file has helper functions for making API calls
// all fetch requests go through here so we don't repeat headers everywhere

// get the JWT token from local storage
const getToken = () => localStorage.getItem('token');

// build the common headers we send with every request
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`,
});

// GET request - used to fetch data from the backend
export const get = async (url) => {
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

// POST request - used to create new records
export const post = async (url, body) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

// PUT request - used to update existing records
export const put = async (url, body) => {
  const response = await fetch(url, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return { ok: response.ok, data };
};

// DELETE request - used to remove records
export const del = async (url) => {
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  return { ok: response.ok };
};
