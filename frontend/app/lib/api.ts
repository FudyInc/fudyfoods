import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
type ProductPayload = Record<string, unknown>

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Products
export const productAPI = {
  getAll: () => api.get('/products/'),
  getById: (id: number) => api.get(`/products/${id}`),
  create: (data: ProductPayload) => api.post('/products/', data),
  update: (id: number, data: ProductPayload) => api.put(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
}

// Analytics
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSalesTrend: () => api.get('/analytics/sales-trend'),
}

// Health
export const healthAPI = {
  check: () => api.get('/health'),
}
