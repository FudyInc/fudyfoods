import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Navbar } from './components/navbar'
import '../styles/globals.css'

export const metadata: Metadata = {
  title: 'Fudyfoods Dashboard',
  description: 'Professional dashboard for Fudyfoods',
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
