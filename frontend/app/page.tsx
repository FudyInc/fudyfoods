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
  Bell,
  CircleDollarSign,
  Clock3,
  LayoutDashboard,
  MessageSquare,
  Package,
  Search,
  Settings,
  ShoppingBag,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Utensils,
  WalletCards,
  Zap,
} from 'lucide-react'
import { analyticsAPI } from './lib/api'

interface TopProduct {
  product_id: string | number
  quantity: number
  total_price?: number
  created_at?: string
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

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, active: true },
  { label: 'Ventas', icon: CircleDollarSign },
  { label: 'Productos', icon: ShoppingBag },
  { label: 'Mensajes', icon: MessageSquare, ping: true },
  { label: 'Ajustes', icon: Settings },
]

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

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)

const compactNumber = (value: number) =>
  new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)

const formatDateLabel = (date: string) => {
  const [, month, day] = date.split('-')
  return month && day ? `${day}/${month}` : date
}

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
    <div className="min-h-screen overflow-hidden bg-[#040410] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(110,17,116,0.28),rgba(31,15,103,0.16)_38%,rgba(4,4,16,0.86)_72%)]" />
      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[228px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-[#0b0b2b]/80 px-6 py-8 shadow-[18px_0_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:block">
          <div className="mb-14 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 text-[#040410] shadow-[0_0_30px_rgba(103,232,249,0.35)]">
              <Utensils size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Fudyfoods</p>
              <p className="text-xs text-slate-500">Control center</p>
            </div>
          </div>

          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon

              return (
                <button
                  key={item.label}
                  type="button"
                  className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition duration-300 ${
                    item.active
                      ? 'bg-white/10 text-white shadow-[0_16px_45px_rgba(45,47,207,0.24)]'
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />
                    {item.label}
                  </span>
                  {item.ping && <span className="h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_18px_rgba(244,114,182,0.8)]" />}
                </button>
              )
            })}
          </nav>

          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-200">
              <Sparkles size={22} />
            </div>
            <p className="text-sm font-semibold text-white">Smart kitchen pulse</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">Ventas, cocina y productos en un solo panel.</p>
            <button
              type="button"
              className="mt-5 w-full rounded-2xl bg-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Ver resumen
            </button>
          </div>
        </aside>

        <main className="relative px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
          <header className="mb-6 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">Live dashboard</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">Fudyfoods Analytics</h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden min-w-[230px] items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0d32]/80 px-4 py-3 text-sm text-slate-400 md:flex">
                <Search size={17} />
                <span>Buscar orden o producto</span>
              </div>
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-fuchsia-400" />
              </button>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-fuchsia-300 text-xs font-black text-[#040410]">
                  FY
                </div>
                <div className="hidden text-sm sm:block">
                  <p className="font-semibold text-white">Fudy Team</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </div>
            </div>
          </header>

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
                  <button
                    type="button"
                    className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
                  >
                    Ver todo
                  </button>
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
        </main>
      </div>
    </div>
  )
}
