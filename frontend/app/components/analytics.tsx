'use client'

import { useEffect, useState, type FC } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts'
import { analyticsAPI } from '../lib/api'
import { LoadingSpinner, ErrorMessage } from './ui'

interface TopProduct {
  product_id: string | number
  quantity: number
}

interface AnalyticsData {
  total_sales: number
  total_products_sold: number
  average_order_value: number
  top_products: TopProduct[]
}

interface SalesTrendData {
  trend: Record<string, number>
}

export const AnalyticsChart: FC = () => {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [trend, setTrend] = useState<SalesTrendData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [dashboardRes, trendRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getSalesTrend(),
        ])
        setData(dashboardRes.data)
        setTrend(trendRes.data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  if (loading) return <LoadingSpinner />
  if (error) return <ErrorMessage message={error} />
  if (!data) return <ErrorMessage message="No data available" />

  const trendData = Object.entries(trend?.trend || {}).map(([date, value]) => ({
    date,
    sales: value,
  }))

  return (
    <div className="space-y-8">
      {/* Sales Trend */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Sales Trend</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#3b82f6"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Top Products</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.top_products.slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="product_id" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#8b5cf6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
