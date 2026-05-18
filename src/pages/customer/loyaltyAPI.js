import api from '../../services/api'

// Get loyalty summary for a customer
export const getLoyaltySummary = (customerId) => api.get(`/loyalty/${customerId}`)

// Check discount eligibility
export const checkDiscountEligibility = (customerId, subTotal) =>
  api.get(`/loyalty/${customerId}/check-discount?subTotal=${subTotal}`)