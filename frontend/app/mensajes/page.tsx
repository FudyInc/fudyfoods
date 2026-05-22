'use client'

import { useMemo, useState } from 'react'
import { CheckCircle2, MessageSquare, Send, Sparkles } from 'lucide-react'
import { DashboardShell } from '../components/dashboard-shell'

const initialMessages = [
  {
    id: 1,
    from: 'Cocina',
    subject: 'Pedido especial listo',
    detail: 'La orden de mesa 12 ya salio con notas de alergia revisadas.',
    time: 'Hace 4 min',
    unread: true,
  },
  {
    id: 2,
    from: 'Inventario',
    subject: 'Stock bajo detectado',
    detail: 'Limonada Menta quedo bajo el umbral recomendado para hora punta.',
    time: 'Hace 18 min',
    unread: true,
  },
  {
    id: 3,
    from: 'Ventas',
    subject: 'Nuevo peak de conversion',
    detail: 'El ticket promedio subio frente al cierre anterior.',
    time: 'Hace 1 h',
    unread: false,
  },
]

export default function MessagesPage() {
  const [messages, setMessages] = useState(initialMessages)
  const [draft, setDraft] = useState('')

  const unreadCount = useMemo(
    () => messages.filter((message) => message.unread).length,
    [messages],
  )

  const markAllRead = () => {
    setMessages((current) => current.map((message) => ({ ...message, unread: false })))
  }

  const sendMessage = () => {
    if (!draft.trim()) return

    setMessages((current) => [
      {
        id: Date.now(),
        from: 'Fudy Team',
        subject: 'Nota interna',
        detail: draft.trim(),
        time: 'Ahora',
        unread: false,
      },
      ...current,
    ])
    setDraft('')
  }

  return (
    <DashboardShell eyebrow="Team inbox" title="Mensajes">
      <section className="grid gap-4 md:grid-cols-3">
        <article className="rounded-[28px] border border-white/10 bg-[#101035]/75 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
          <p className="text-sm text-slate-500">No leidos</p>
          <p className="mt-2 text-3xl font-semibold text-white">{unreadCount}</p>
        </article>
        <article className="rounded-[28px] border border-white/10 bg-[#101035]/75 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
          <p className="text-sm text-slate-500">Canales activos</p>
          <p className="mt-2 text-3xl font-semibold text-white">3</p>
        </article>
        <article className="rounded-[28px] border border-white/10 bg-[#101035]/75 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
          <p className="text-sm text-slate-500">Respuesta promedio</p>
          <p className="mt-2 text-3xl font-semibold text-white">8m</p>
        </article>
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="rounded-[32px] border border-white/10 bg-[#101035]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Inbox operacional</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Alertas y conversaciones</h2>
            </div>
            <button
              type="button"
              onClick={markAllRead}
              className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <CheckCircle2 size={15} />
              Marcar leidos
            </button>
          </div>

          <div className="space-y-3">
            {messages.map((message) => (
              <button
                key={message.id}
                type="button"
                onClick={() =>
                  setMessages((current) =>
                    current.map((item) =>
                      item.id === message.id ? { ...item, unread: false } : item,
                    ),
                  )
                }
                className="grid w-full gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition hover:bg-white/[0.06] md:grid-cols-[42px_minmax(0,1fr)_90px]"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
                  <MessageSquare size={17} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold text-white">{message.subject}</p>
                    {message.unread && <span className="h-2 w-2 rounded-full bg-fuchsia-400" />}
                  </div>
                  <p className="mt-1 text-xs font-semibold text-slate-400">{message.from}</p>
                  <p className="mt-1 text-xs leading-5 text-slate-500">{message.detail}</p>
                </div>
                <p className="text-xs text-slate-500 md:text-right">{message.time}</p>
              </button>
            ))}
          </div>
        </div>

        <aside className="rounded-[32px] border border-white/10 bg-[#14143d]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Composer</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Nota rapida</h2>
            </div>
            <Sparkles className="text-amber-200" size={20} />
          </div>
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            className="min-h-40 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
            placeholder="Escribe una nota para cocina, ventas o inventario..."
          />
          <button
            type="button"
            onClick={sendMessage}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#040410] transition hover:bg-cyan-200"
          >
            <Send size={16} />
            Enviar nota
          </button>
        </aside>
      </section>
    </DashboardShell>
  )
}
