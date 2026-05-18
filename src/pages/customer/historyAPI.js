import api from '../../services/api'

// Get full history (purchases + services)
export const getFullHistory = (customerId) => api.get(`/customerhistory/${customerId}`)

// Get only purchase history
export const getPurchaseHistory = (customerId) => api.get(`/customerhistory/${customerId}/purchases`)

// Get only service history
export const getServiceHistory = (customerId) => api.get(`/customerhistory/${customerId}/services`)