import api from './api'

// Create a new sale invoice
export const createInvoice = (data) => api.post('/invoice', data)

// Get invoice by ID
export const getInvoiceById = (id) => api.get(`/invoice/${id}`)

// Get all invoices for a customer
export const getInvoicesByCustomer = (customerId) => api.get(`/invoice/customer/${customerId}`)