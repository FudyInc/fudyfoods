'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import {
  Bell,
  CircleDollarSign,
  LayoutDashboard,
  MessageSquare,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Utensils,
} from 'lucide-react'

interface DashboardShellProps {
  eyebrow: string
  title: string
  children: ReactNode
}

const navItems = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Ventas', href: '/ventas', icon: CircleDollarSign },
  { label: 'Productos', href: '/productos', icon: ShoppingBag },
  { label: 'Mensajes', href: '/mensajes', icon: MessageSquare, ping: true },
  { label: 'Ajustes', href: '/ajustes', icon: Settings },
]

export function DashboardShell({ eyebrow, title, children }: DashboardShellProps) {
  const pathname = usePathname() ?? '/'

  return (
    <div className="min-h-screen overflow-hidden bg-[#040410] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[linear-gradient(135deg,rgba(110,17,116,0.28),rgba(31,15,103,0.16)_38%,rgba(4,4,16,0.86)_72%)]" />
      <div className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[228px_minmax(0,1fr)]">
        <aside className="hidden border-r border-white/10 bg-[#0b0b2b]/80 px-6 py-8 shadow-[18px_0_80px_rgba(0,0,0,0.35)] backdrop-blur-xl lg:block">
          <Link href="/" className="mb-14 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300 text-[#040410] shadow-[0_0_30px_rgba(103,232,249,0.35)]">
              <Utensils size={20} />
            </div>
            <div>
              <p className="text-sm font-semibold tracking-wide text-white">Fudyfoods</p>
              <p className="text-xs text-slate-500">Control center</p>
            </div>
          </Link>

          <nav className="space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`group flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left text-sm transition duration-300 ${
                    isActive
                      ? 'bg-white/10 text-white shadow-[0_16px_45px_rgba(45,47,207,0.24)]'
                      : 'text-slate-500 hover:bg-white/5 hover:text-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-3">
                    <Icon size={17} />
                    {item.label}
                  </span>
                  {item.ping && (
                    <span className="h-2 w-2 rounded-full bg-fuchsia-400 shadow-[0_0_18px_rgba(244,114,182,0.8)]" />
                  )}
                </Link>
              )
            })}
          </nav>

          <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.04] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)]">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-300/20 text-amber-200">
              <Sparkles size={22} />
            </div>
            <p className="text-sm font-semibold text-white">Smart kitchen pulse</p>
            <p className="mt-2 text-xs leading-5 text-slate-500">
              Ventas, cocina y productos en un solo panel.
            </p>
            <Link
              href="/ventas"
              className="mt-5 block w-full rounded-2xl bg-white/10 px-4 py-2 text-center text-xs font-semibold text-white transition hover:bg-white/20"
            >
              Ver resumen
            </Link>
          </div>
        </aside>

        <main className="relative px-4 py-5 sm:px-6 lg:px-8 xl:px-10">
          <header className="mb-4 flex flex-col gap-4 rounded-[28px] border border-white/10 bg-white/[0.035] p-4 shadow-[0_24px_90px_rgba(0,0,0,0.24)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200/80">
                {eyebrow}
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white md:text-4xl">
                {title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="hidden min-w-[230px] items-center gap-3 rounded-2xl border border-white/10 bg-[#0d0d32]/80 px-4 py-3 text-sm text-slate-400 md:flex">
                <Search size={17} />
                <span>Buscar orden o producto</span>
              </div>
              <Link
                href="/mensajes"
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06] text-slate-300 transition hover:bg-white/10 hover:text-white"
                aria-label="Notifications"
              >
                <Bell size={18} />
                <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-fuchsia-400" />
              </Link>
              <Link
                href="/ajustes"
                className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.06] px-3 py-2 transition hover:bg-white/10"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-fuchsia-300 text-xs font-black text-[#040410]">
                  FY
                </div>
                <div className="hidden text-sm sm:block">
                  <p className="font-semibold text-white">Fudy Team</p>
                  <p className="text-xs text-slate-500">Admin</p>
                </div>
              </Link>
            </div>
          </header>

          <nav className="mb-5 grid grid-cols-5 gap-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive =
                item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex min-h-14 flex-col items-center justify-center gap-1 rounded-2xl border px-2 text-[11px] font-semibold transition ${
                    isActive
                      ? 'border-cyan-300/30 bg-cyan-300/10 text-cyan-100'
                      : 'border-white/10 bg-white/[0.035] text-slate-500'
                  }`}
                >
                  <Icon size={16} />
                  <span className="max-w-full truncate">{item.label}</span>
                </Link>
              )
            })}
          </nav>

          {children}
        </main>
      </div>
    </div>
  )
}
