'use client'

import { useState, type FC } from 'react'
import { Menu, X } from 'lucide-react'

export const Navbar: FC = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-slate-900">🍹 Fudyfoods</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="/"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Dashboard
            </a>
            <a
              href="/productos"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Productos
            </a>
            <a
              href="/ventas"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Ventas
            </a>
            <a
              href="/ajustes"
              className="text-slate-600 hover:text-slate-900 font-medium"
            >
              Ajustes
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 hover:text-slate-900"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <a
              href="/"
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
            >
              Dashboard
            </a>
            <a
              href="/productos"
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
            >
              Productos
            </a>
            <a
              href="/ventas"
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
            >
              Ventas
            </a>
            <a
              href="/ajustes"
              className="block text-slate-600 hover:text-slate-900 font-medium py-2"
            >
              Ajustes
            </a>
          </div>
        )}
      </div>
    </nav>
  )
}
