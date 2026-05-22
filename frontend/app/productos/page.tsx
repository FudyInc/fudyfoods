'use client'

import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
import { AlertCircle, PackagePlus, Pencil, RefreshCw, Trash2 } from 'lucide-react'
import { DashboardShell } from '../components/dashboard-shell'
import { type Product, type ProductPayload, productAPI } from '../lib/api'
import { formatCurrency } from '../lib/format'

const demoProducts: Product[] = [
  {
    id: 1001,
    name: 'Bowl Andino',
    description: 'Base de quinoa, vegetales asados y salsa verde.',
    price: 19,
    quantity: 42,
    created_at: '2026-05-18T12:00:00Z',
  },
  {
    id: 1002,
    name: 'Wrap Veggie',
    description: 'Wrap fresco con hummus, palta y vegetales.',
    price: 16,
    quantity: 28,
    created_at: '2026-05-19T12:00:00Z',
  },
  {
    id: 1003,
    name: 'Limonada Menta',
    description: 'Bebida fria de limon, menta y ginger.',
    price: 7,
    quantity: 64,
    created_at: '2026-05-20T12:00:00Z',
  },
]

const emptyForm = {
  name: '',
  description: '',
  price: '',
  quantity: '',
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(demoProducts)
  const [mode, setMode] = useState<'loading' | 'live' | 'demo'>('loading')
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)

  const loadProducts = useCallback(async () => {
    setMode('loading')
    setError(null)

    try {
      const response = await productAPI.getAll()
      setProducts(response.data.length > 0 ? response.data : demoProducts)
      setMode('live')
    } catch (err) {
      setProducts(demoProducts)
      setError(err instanceof Error ? err.message : 'No se pudo conectar con productos')
      setMode('demo')
    }
  }, [])

  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  const stats = useMemo(() => {
    const inventoryValue = products.reduce((total, product) => total + product.price * product.quantity, 0)
    const lowStock = products.filter((product) => product.quantity <= 10).length

    return {
      totalProducts: products.length,
      inventoryValue,
      units: products.reduce((total, product) => total + product.quantity, 0),
      lowStock,
    }
  }, [products])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const payload: ProductPayload = {
      name: form.name.trim(),
      description: form.description.trim(),
      price: Number(form.price),
      quantity: Number(form.quantity),
    }

    if (!payload.name || Number.isNaN(payload.price) || Number.isNaN(payload.quantity)) {
      setError('Completa nombre, precio y stock con valores validos.')
      setSaving(false)
      return
    }

    try {
      if (mode === 'live') {
        if (editingId) {
          const response = await productAPI.update(editingId, payload)
          setProducts((current) =>
            current.map((product) => (product.id === editingId ? response.data : product)),
          )
        } else {
          const response = await productAPI.create(payload)
          setProducts((current) => [response.data, ...current])
        }
      } else {
        if (editingId) {
          setProducts((current) =>
            current.map((product) =>
              product.id === editingId ? { ...product, ...payload } : product,
            ),
          )
        } else {
          setProducts((current) => [
            {
              ...payload,
              id: Date.now(),
              created_at: new Date().toISOString(),
            },
            ...current,
          ])
        }
      }
      setForm(emptyForm)
      setEditingId(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo crear el producto')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (product: Product) => {
    const confirmed = window.confirm(`Eliminar ${product.name}?`)
    if (!confirmed) return

    setError(null)

    try {
      if (mode === 'live') {
        await productAPI.delete(product.id)
      }
      setProducts((current) => current.filter((item) => item.id !== product.id))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo eliminar el producto')
    }
  }

  const startEditing = (product: Product) => {
    setEditingId(product.id)
    setForm({
      name: product.name,
      description: product.description || '',
      price: String(product.price),
      quantity: String(product.quantity),
    })
  }

  return (
    <DashboardShell eyebrow="Catalog manager" title="Productos">
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Productos" value={stats.totalProducts} />
        <StatCard label="Valor inventario" value={formatCurrency(stats.inventoryValue)} />
        <StatCard label="Unidades" value={stats.units} />
        <StatCard label="Stock bajo" value={stats.lowStock} tone={stats.lowStock > 0 ? 'text-amber-200' : 'text-emerald-200'} />
      </section>

      <section className="mt-5 grid gap-5 xl:grid-cols-[380px_minmax(0,1fr)]">
        <form onSubmit={handleSubmit} className="rounded-[32px] border border-white/10 bg-[#101035]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Nuevo item</p>
              <h2 className="mt-1 text-xl font-semibold text-white">
                {editingId ? 'Editar producto' : 'Agregar producto'}
              </h2>
            </div>
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-300/10 text-cyan-200">
              <PackagePlus size={20} />
            </div>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Nombre</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
                placeholder="Ej. Bowl Andino"
              />
            </label>

            <label className="block">
              <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Descripcion</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
                placeholder="Notas de cocina, ingredientes o categoria"
              />
            </label>

            <div className="grid gap-3 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Precio</span>
                <input
                  value={form.price}
                  onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                  type="number"
                  min="0"
                  step="0.01"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
                  placeholder="19.00"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Stock</span>
                <input
                  value={form.quantity}
                  onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                  type="number"
                  min="0"
                  step="1"
                  className="mt-2 w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-300/40"
                  placeholder="42"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#040410] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Guardando...' : editingId ? 'Actualizar producto' : 'Guardar producto'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null)
                  setForm(emptyForm)
                }}
                className="w-full rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Cancelar edicion
              </button>
            )}
          </div>
        </form>

        <div className="rounded-[32px] border border-white/10 bg-[#101035]/80 p-5 shadow-[0_28px_100px_rgba(0,0,0,0.28)]">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Catalogo</p>
              <h2 className="mt-1 text-xl font-semibold text-white">Inventario activo</h2>
            </div>
            <button
              type="button"
              onClick={loadProducts}
              className="flex w-fit items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-2 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
            >
              <RefreshCw size={15} />
              Recargar
            </button>
          </div>

          {error && (
            <div className="mb-4 flex gap-3 rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4 text-sm text-amber-100">
              <AlertCircle className="mt-0.5 shrink-0" size={17} />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-3">
            {products.map((product) => (
              <article key={product.id} className="grid gap-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 md:grid-cols-[minmax(0,1fr)_120px_120px_90px] md:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{product.name}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                    {product.description || 'Sin descripcion'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Precio</p>
                  <p className="text-sm font-semibold text-emerald-200">{formatCurrency(product.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Stock</p>
                  <p className={`text-sm font-semibold ${product.quantity <= 10 ? 'text-amber-200' : 'text-cyan-200'}`}>
                    {product.quantity} unidades
                  </p>
                </div>
                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => startEditing(product)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.06] text-slate-400"
                    aria-label="Editar producto"
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(product)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-fuchsia-400/10 text-fuchsia-200 transition hover:bg-fuchsia-400/20"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </article>
            ))}
          </div>

          <p className="mt-5 text-xs text-slate-500">
            Estado: {mode === 'live' ? 'conectado al backend' : mode === 'loading' ? 'sincronizando' : 'modo demo con fallback local'}.
          </p>
        </div>
      </section>
    </DashboardShell>
  )
}

function StatCard({
  label,
  value,
  tone = 'text-white',
}: {
  label: string
  value: string | number
  tone?: string
}) {
  return (
    <article className="rounded-[28px] border border-white/10 bg-[#101035]/75 p-5 shadow-[0_22px_70px_rgba(0,0,0,0.28)]">
      <p className="text-sm text-slate-500">{label}</p>
      <p className={`mt-2 text-3xl font-semibold tracking-tight ${tone}`}>{value}</p>
    </article>
  )
}
