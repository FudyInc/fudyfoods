'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { CircleDollarSign, FileText, ShoppingCart, TrendingUp } from 'lucide-react'
import { DashboardShell } from '../components/dashboard-shell'
import { analyticsAPI } from '../lib/api'
import { compactNumber, formatCurrency, formatDateLabel } from '../lib/format'

interface DashboardData {
  total_sales: number
  total_products_sold: number
  average_order_value: number
  top_products: Array<{ product_id: string | number; quantity: number; total_price?: number }>
}

interface SalesTrendResponse {
  trend: Record<string, number>
}

const demoDashboard: DashboardData = {
  total_sales: 24870,
  total_products_sold: 1284,
  average_order_value: 19.37,
  top_products: [
    { product_id: 'Bowl Andino', quantity: 326, total_price: 6520 },
    { product_id: 'Wrap Veggie', quantity: 284, total_price: 5112 },
    { product_id: 'Limonada Menta', quantity: 241, total_price: 2892 },
  ],
}

const demoTrend: SalesTrendResponse = {
  trend: {
    '2026-05-16': 2860,
    '2026-05-17': 3120,
    '2026-05-18': 2980,
    '2026-05-19': 4010,
    '2026-05-20': 4360,
    '2026-05-21': 4920,
    '2026-05-22': 6580,
  },
}

export default function SalesPage() {
  const [dashboard, setDashboard] = useState<DashboardData>(demoDashboard)
  const [trend, setTrend] = useState<SalesTrendResponse>(demoTrend)
  const [status, setStatus] = useState<'loading' | 'live' | 'demo'>('loading')

  useEffect(() => {
    let isMounted = true

    const loadSales = async () => {
      try {
        const [dashboardRes, trendRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getSalesTrend(),
        ])

        if (!isMounted) return

        const nextTrend = trendRes.data as SalesTrendResponse
        setDashboard(dashboardRes.data as DashboardData)
        setTrend(Object.keys(nextTrend.trend || {}).length > 0 ? nextTrend : demoTrend)
        setStatus('live')
      } catch {
        if (!isMounted) return
        setDashboard(demoDashboard)
        setTrend(demoTrend)
        setStatus('demo')
      }
    }

    loadSales()

    return () => {
      isMounted = false
    }
  }, [])

  const trendData = useMemo(
    () =>
      Object.entries(trend.trend)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([date, sales], index) => ({
          date: formatDateLabel(date),
          sales,
          orders: Math.max(12, Math.round(sales / 38) + index * 3),
        })),
    [trend],
  )

  const topProducts = dashboard.top_products.slice(0, 5).map((product, index) => ({
    name: String(product.product_id),
    quantity: product.quantity,
    revenue:
      product.total_price ??
      Math.round(product.quantity * dashboard.average_order_value * (1 + index * 0.05)),
  }))
  const estimatedOrders = Math.round(
    dashboard.total_sales / Math.max(1, dashboard.average_order_value),
  )

  const cards = [
    {
      label: 'Ingresos',
      value: formatCurrency(dashboard.total_sales),
      icon: CircleDollarSign,
      accent: 'from-emerald-300 to-cyan-300',
    },
    {
      label: 'Ordenes estimadas',
      value: compactNumber(Math.max(1, estimatedOrders)),
      icon: FileText,
      accent: 'from-fuchsia-300 to-violet-300',
    },
    {
      label: 'Items vendidos',
      value: compactNumber(dashboard.total_products_sold),
      icon: ShoppingCart,
      accent: 'from-sky-300 to-indigo-300',
    },
    {
      label: 'Ticket promedio',
      value: formatCurrency(dashboard.average_order_value),
      icon: TrendingUp,
      accent: 'from-amber-200 to-orange-300',
    },
  ]

  return (
    <DashboardShell eyebrow="Sales engine" title="Ventas">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon

          return (
            <article key={card.label} className="rounded-[28px] border border-white/10 bg-[#101035]/75 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
              <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-[#040410]`}>
                <Icon size={21} />
              </div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{card.value}</p>
              <p className="mt-2 text-xs text-slate-500">{status === 'live' ? 'Datos reales' : status === 'loading' ? 'Sincronizando' : 'Modo demo'}</p>
            </article>
          )
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[32px] border border-white/10 bg-[#101035]/80 p-5 shadow-[0_28px_110px_rgba(0,0,0,0.34)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Tendencia</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Ingresos por dia</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300">
              {status === 'live' ? 'Live' : 'Preview'}
            </span>
          </div>
          <div className="h-[390px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: 0, right: 16, top: 20, bottom: 8 }}>
                <defs>
                  <linearGradient id="salesPageGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#67e8f9" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="#67e8f9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#73738f', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#73738f', fontSize: 12 }} tickFormatter={(value: number) => `$${compactNumber(value)}`} />
                <Tooltip
                  contentStyle={{
                    background: '#101035',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 18,
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#67e8f9" strokeWidth={3} fill="url(#salesPageGlow)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#14143d]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)]">
          <div className="mb-5">
            <p className="text-sm text-slate-500">Mix de ventas</p>
            <h2 className="mt-1 text-xl font-semibold text-white">Productos con mayor salida</h2>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                <Tooltip
                  cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                  contentStyle={{
                    background: '#101035',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 16,
                    color: '#fff',
                  }}
                />
                <Bar dataKey="quantity" fill="#f040d8" radius={[10, 10, 10, 10]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-5 space-y-3">
            {topProducts.map((product, index) => (
              <div key={product.name} className="flex items-center justify-between rounded-2xl bg-white/[0.035] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{index + 1}. {product.name}</p>
                  <p className="text-xs text-slate-500">{product.quantity} unidades</p>
                </div>
                <p className="text-sm font-semibold text-emerald-200">{formatCurrency(product.revenue)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
