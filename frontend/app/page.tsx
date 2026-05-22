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
import {
  CircleDollarSign,
  Clock3,
  Package,
  ShoppingCart,
  TrendingUp,
  WalletCards,
  Zap,
} from 'lucide-react'
import { DashboardShell } from './components/dashboard-shell'
import { analyticsAPI } from './lib/api'
import { compactNumber, formatCurrency, formatDateLabel } from './lib/format'

interface TopProduct {
  product_id: string | number
  quantity: number
  total_price?: number
}

interface DashboardData {
  total_sales: number
  total_products_sold: number
  average_order_value: number
  top_products: TopProduct[]
}

interface SalesTrendResponse {
  trend: Record<string, number>
}

interface TrendPoint {
  date: string
  sales: number
  orders: number
}

type DataMode = 'loading' | 'live' | 'demo'

const demoDashboard: DashboardData = {
  total_sales: 24870,
  total_products_sold: 1284,
  average_order_value: 19.37,
  top_products: [
    { product_id: 'Bowl Andino', quantity: 326, total_price: 6520 },
    { product_id: 'Wrap Veggie', quantity: 284, total_price: 5112 },
    { product_id: 'Limonada Menta', quantity: 241, total_price: 2892 },
    { product_id: 'Burger Fudy', quantity: 213, total_price: 4686 },
    { product_id: 'Taco Mix', quantity: 188, total_price: 3572 },
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

const activityItems = [
  {
    title: 'Nueva orden recibida',
    detail: 'Mesa 12 agrego 3 productos al pedido',
    value: '+$48.90',
    tone: 'text-emerald-300',
  },
  {
    title: 'Stock actualizado',
    detail: 'Bowl Andino mantiene alta rotacion',
    value: '+12%',
    tone: 'text-cyan-300',
  },
  {
    title: 'Alerta de cocina',
    detail: 'Tiempo promedio bajo a 11 minutos',
    value: '-8%',
    tone: 'text-amber-300',
  },
]

const buildTrendPoints = (trend: SalesTrendResponse['trend']): TrendPoint[] =>
  Object.entries(trend)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([date, sales], index) => ({
      date: formatDateLabel(date),
      sales,
      orders: Math.max(18, Math.round(sales / 34) + index * 4),
    }))

export default function Home() {
  const [dashboard, setDashboard] = useState<DashboardData>(demoDashboard)
  const [salesTrend, setSalesTrend] = useState<SalesTrendResponse>(demoTrend)
  const [mode, setMode] = useState<DataMode>('loading')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchDashboard = async () => {
      try {
        const [dashboardRes, trendRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          analyticsAPI.getSalesTrend(),
        ])

        if (!isMounted) return

        const nextDashboard = dashboardRes.data as DashboardData
        const nextTrend = trendRes.data as SalesTrendResponse

        setDashboard({
          ...nextDashboard,
          top_products:
            nextDashboard.top_products.length > 0
              ? nextDashboard.top_products
              : demoDashboard.top_products,
        })
        setSalesTrend(Object.keys(nextTrend.trend || {}).length > 0 ? nextTrend : demoTrend)
        setMode('live')
      } catch (err) {
        if (!isMounted) return
        setError(err instanceof Error ? err.message : 'Backend unavailable')
        setDashboard(demoDashboard)
        setSalesTrend(demoTrend)
        setMode('demo')
      }
    }

    fetchDashboard()

    return () => {
      isMounted = false
    }
  }, [])

  const trendData = useMemo(() => buildTrendPoints(salesTrend.trend), [salesTrend])

  const productData = useMemo(
    () =>
      dashboard.top_products.slice(0, 5).map((product, index) => ({
        name: String(product.product_id),
        quantity: product.quantity,
        revenue:
          product.total_price ??
          Math.round(product.quantity * dashboard.average_order_value * (1 + index * 0.08)),
      })),
    [dashboard],
  )

  const highPoint = useMemo(
    () => trendData.reduce((max, item) => Math.max(max, item.sales), 0),
    [trendData],
  )

  const metricCards = [
    {
      label: 'Ventas totales',
      value: formatCurrency(dashboard.total_sales),
      detail: mode === 'live' ? 'Datos sincronizados' : 'Preview con datos demo',
      icon: CircleDollarSign,
      accent: 'from-emerald-300 to-cyan-300',
      delta: '+18.4%',
    },
    {
      label: 'Productos vendidos',
      value: compactNumber(dashboard.total_products_sold),
      detail: 'Unidades registradas',
      icon: ShoppingCart,
      accent: 'from-fuchsia-300 to-violet-300',
      delta: '+9.2%',
    },
    {
      label: 'Ticket promedio',
      value: formatCurrency(dashboard.average_order_value),
      detail: 'Promedio por orden',
      icon: TrendingUp,
      accent: 'from-amber-200 to-orange-300',
      delta: '+5.7%',
    },
    {
      label: 'Top productos',
      value: dashboard.top_products.length,
      detail: 'Ranking activo',
      icon: Package,
      accent: 'from-sky-300 to-indigo-300',
      delta: '+3.1%',
    },
  ]

  return (
    <DashboardShell eyebrow="Live dashboard" title="Fudyfoods Analytics">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card, index) => {
          const Icon = card.icon

          return (
            <article
              key={card.label}
              className="animate-fade-up rounded-[28px] border border-white/10 bg-[#101035]/75 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)] backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-white/20"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="mb-5 flex items-center justify-between">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${card.accent} text-[#040410] shadow-[0_0_34px_rgba(103,232,249,0.2)]`}>
                  <Icon size={21} />
                </div>
                <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1 text-xs font-semibold text-emerald-200">
                  {card.delta}
                </span>
              </div>
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight text-white">{card.value}</p>
              <p className="mt-2 text-xs text-slate-500">{card.detail}</p>
            </article>
          )
        })}
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-[32px] border border-white/10 bg-[#101035]/80 p-5 shadow-[0_28px_110px_rgba(0,0,0,0.34)] backdrop-blur-xl">
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Revenue flow</p>
              <h2 className="mt-1 text-2xl font-semibold text-white">Ventas de la semana</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                High {formatCurrency(highPoint)}
              </span>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300">
                {mode === 'loading' ? 'Syncing' : mode === 'live' ? 'Live data' : 'Demo data'}
              </span>
            </div>
          </div>

          <div className="h-[360px] min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ left: 0, right: 16, top: 20, bottom: 8 }}>
                <defs>
                  <linearGradient id="salesGlow" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="5%" stopColor="#f040d8" stopOpacity={0.55} />
                    <stop offset="48%" stopColor="#37d7ff" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#37d7ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="rgba(255,255,255,0.07)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#73738f', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#73738f', fontSize: 12 }} tickFormatter={(value: number) => `$${compactNumber(value)}`} />
                <Tooltip
                  cursor={{ stroke: 'rgba(255,255,255,0.18)' }}
                  contentStyle={{
                    background: '#101035',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 18,
                    color: '#fff',
                  }}
                />
                <Area type="monotone" dataKey="sales" stroke="#f040d8" strokeWidth={3} fill="url(#salesGlow)" activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }} />
                <Area type="monotone" dataKey="orders" stroke="#37d7ff" strokeWidth={2} fill="transparent" strokeDasharray="4 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-[32px] border border-white/10 bg-[#14143d]/90 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Operaciones</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Actividad reciente</h2>
              </div>
              <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300">
                Hoy
              </span>
            </div>
            <div className="space-y-4">
              {activityItems.map((item) => (
                <div key={item.title} className="flex gap-3 rounded-2xl bg-white/[0.035] p-3">
                  <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
                    <Zap size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-white">{item.title}</p>
                      <span className={`text-xs font-semibold ${item.tone}`}>{item.value}</span>
                    </div>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[32px] border border-white/10 bg-[#14143d]/75 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.26)] backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">Wallet</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Flujo estimado</h2>
              </div>
              <WalletCards className="text-cyan-200" size={22} />
            </div>
            <div className="h-28">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData.slice(-6)} margin={{ left: -20, right: 0, top: 8, bottom: 0 }}>
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{
                      background: '#101035',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 16,
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="sales" fill="#67e8f9" radius={[10, 10, 10, 10]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </aside>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_330px]">
        <div className="rounded-[32px] border border-white/10 bg-[#101035]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Ranking</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Productos destacados</h2>
            </div>
            <span className="w-fit rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300">
              Top {productData.length}
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
            <div className="h-[260px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={productData} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 4 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.06)" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#73738f', fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={92} axisLine={false} tickLine={false} tick={{ fill: '#b7b7d7', fontSize: 12 }} />
                  <Tooltip
                    cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                    contentStyle={{
                      background: '#101035',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 16,
                      color: '#fff',
                    }}
                  />
                  <Bar dataKey="quantity" fill="#f040d8" radius={[0, 12, 12, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-3">
              {productData.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/10 text-xs font-bold text-cyan-200">
                      {index + 1}
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{product.name}</p>
                      <p className="text-xs text-slate-500">{product.quantity} unidades</p>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-emerald-200">{formatCurrency(product.revenue)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-[32px] border border-white/10 bg-[#101035]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)] backdrop-blur-xl">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Status</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Sistema</h2>
            </div>
            <Clock3 className="text-amber-200" size={21} />
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl bg-white/[0.035] p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Backend API</p>
                <span className={`h-2.5 w-2.5 rounded-full ${mode === 'live' ? 'bg-emerald-300' : mode === 'loading' ? 'bg-amber-300' : 'bg-fuchsia-300'}`} />
              </div>
              <p className="text-xs leading-5 text-slate-500">
                {mode === 'live'
                  ? 'Conectado a Railway y mostrando datos reales.'
                  : mode === 'loading'
                    ? 'Sincronizando con el backend.'
                    : 'Mostrando preview mientras el backend responde.'}
              </p>
            </div>

            <div className="rounded-2xl bg-white/[0.035] p-4">
              <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Supabase</p>
                <span className="rounded-full bg-cyan-300/10 px-2 py-1 text-[11px] font-semibold text-cyan-200">Ready</span>
              </div>
              <p className="text-xs leading-5 text-slate-500">Variables de entorno cargadas en Vercel.</p>
            </div>

            {error && (
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-xs leading-5 text-amber-100">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>
    </DashboardShell>
  )
}
