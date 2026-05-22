'use client'

import { useCallback, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { Database, RefreshCw, Server, ShieldCheck, SlidersHorizontal } from 'lucide-react'
import { DashboardShell } from '../components/dashboard-shell'
import { healthAPI } from '../lib/api'

export default function SettingsPage() {
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking')
  const [message, setMessage] = useState('Verificando API...')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [demoFallback, setDemoFallback] = useState(true)

  const checkHealth = useCallback(async () => {
    setApiStatus('checking')
    setMessage('Verificando API...')

    try {
      const response = await healthAPI.check()
      setApiStatus(response.data.status === 'ok' ? 'online' : 'offline')
      setMessage(response.data.message)
    } catch (err) {
      setApiStatus('offline')
      setMessage(err instanceof Error ? err.message : 'API no disponible')
    }
  }, [])

  useEffect(() => {
    checkHealth()
  }, [checkHealth])

  const statusTone =
    apiStatus === 'online'
      ? 'bg-emerald-300 text-[#040410]'
      : apiStatus === 'checking'
        ? 'bg-amber-300 text-[#040410]'
        : 'bg-fuchsia-400 text-white'

  return (
    <DashboardShell eyebrow="Control panel" title="Ajustes">
      <section className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[32px] border border-white/10 bg-[#101035]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)]">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Conexion</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Estado del sistema</h2>
            </div>
            <button
              type="button"
              onClick={checkHealth}
              className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCw size={15} />
              Revalidar
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatusCard
              icon={<Server size={19} />}
              label="Backend API"
              value={apiStatus === 'online' ? 'Online' : apiStatus === 'checking' ? 'Checking' : 'Offline'}
              badgeClass={statusTone}
            />
            <StatusCard
              icon={<Database size={19} />}
              label="Supabase"
              value="Configured"
              badgeClass="bg-cyan-300 text-[#040410]"
            />
            <StatusCard
              icon={<ShieldCheck size={19} />}
              label="Vercel"
              value="Production"
              badgeClass="bg-emerald-300 text-[#040410]"
            />
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <p className="text-sm font-semibold text-white">Respuesta API</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">{message}</p>
          </div>
        </div>

        <aside className="rounded-[32px] border border-white/10 bg-[#14143d]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Preferencias</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Experiencia</h2>
            </div>
            <SlidersHorizontal className="text-cyan-200" size={20} />
          </div>

          <div className="space-y-3">
            <ToggleRow
              label="Auto refresh"
              detail="Actualizar datos periodicamente."
              checked={autoRefresh}
              onClick={() => setAutoRefresh((current) => !current)}
            />
            <ToggleRow
              label="Fallback demo"
              detail="Mostrar datos demo si el backend falla."
              checked={demoFallback}
              onClick={() => setDemoFallback((current) => !current)}
            />
          </div>
        </aside>
      </section>
    </DashboardShell>
  )
}

function StatusCard({
  icon,
  label,
  value,
  badgeClass,
}: {
  icon: ReactNode
  label: string
  value: string
  badgeClass: string
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-cyan-200">
        {icon}
      </div>
      <p className="text-sm text-slate-500">{label}</p>
      <span className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${badgeClass}`}>
        {value}
      </span>
    </article>
  )
}

function ToggleRow({
  label,
  detail,
  checked,
  onClick,
}: {
  label: string
  detail: string
  checked: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:bg-white/[0.06]"
    >
      <span>
        <span className="block text-sm font-semibold text-white">{label}</span>
        <span className="mt-1 block text-xs leading-5 text-slate-500">{detail}</span>
      </span>
      <span className={`flex h-7 w-12 items-center rounded-full p-1 transition ${checked ? 'bg-cyan-300' : 'bg-white/10'}`}>
        <span className={`h-5 w-5 rounded-full bg-[#040410] transition ${checked ? 'translate-x-5' : ''}`} />
      </span>
    </button>
  )
}
