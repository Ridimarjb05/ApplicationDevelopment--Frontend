import api from './api'

export const getFinancialSummary = () => api.get('/api/financial-report/summary')
export const getMonthlyReport    = () => api.get('/api/financial-report/monthly')
export const getTopParts         = () => api.get('/api/financial-report/top-parts')
