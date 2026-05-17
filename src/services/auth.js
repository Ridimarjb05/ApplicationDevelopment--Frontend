// auth.js — TEMPORARY auth helper.
// Customer ID is hardcoded for now so F13 pages work before login is built.
// When the login feature is integrated, replace the body of
// getCurrentCustomerId() to read the ID from the JWT / localStorage.
// Every F13 page calls this function, so only this one line needs to change.

export const getCurrentCustomerId = () => 1;