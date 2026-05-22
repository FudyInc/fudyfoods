'use client'

import React, { useEffect, useState } from 'react'
import { DashboardHeader, MetricCard, LoadingSpinner, ErrorMessage } from './components/ui'
import { AnalyticsChart } from './components/analytics'
import { analyticsAPI } from './lib/api'
import { TrendingUp, Package, ShoppingCart, DollarSign } from 'lucide-react'

interface DashboardData {
  total_sales: number
  total_products_sold: number
  average_order_value: number
  top_products: any[]
}

export default function Home() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await analyticsAPI.getDashboard()
        setData(response.data)
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="space-y-8">
      <DashboardHeader />

      {loading && <LoadingSpinner />}
      {error && <ErrorMessage message={error} />}

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Total Sales"
              value={`$${data.total_sales.toFixed(2)}`}
              icon={<DollarSign size={24} className="text-green-600" />}
            />
            <MetricCard
              title="Products Sold"
              value={data.total_products_sold}
              icon={<ShoppingCart size={24} className="text-blue-600" />}
            />
            <MetricCard
              title="Average Order Value"
              value={`$${data.average_order_value.toFixed(2)}`}
              icon={<TrendingUp size={24} className="text-purple-600" />}
            />
            <MetricCard
              title="Top Products"
              value={data.top_products.length}
              icon={<Package size={24} className="text-orange-600" />}
            />
          </div>

          <AnalyticsChart />
        </>
      )}
    </div>
  )
}
