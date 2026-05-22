import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'

export interface Product {
  id: number
  name: string
  description?: string | null
  price: number
  quantity: number
  created_at: string
}

export interface ProductPayload {
  name: string
  description?: string
  price: number
  quantity: number
}

export interface HealthResponse {
  status: string
  message: string
}

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Products
export const productAPI = {
  getAll: () => api.get<Product[]>('/products/'),
  getById: (id: number) => api.get<Product>(`/products/${id}`),
  create: (data: ProductPayload) => api.post<Product>('/products/', data),
  update: (id: number, data: ProductPayload) => api.put<Product>(`/products/${id}`, data),
  delete: (id: number) => api.delete(`/products/${id}`),
}

// Analytics
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSalesTrend: () => api.get('/analytics/sales-trend'),
}

// Health
export const healthAPI = {
  check: () => api.get<HealthResponse>('/health'),
}
