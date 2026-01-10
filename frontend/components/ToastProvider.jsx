"use client"

import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const show = (message, opts = {}) => {
    const id = Date.now() + Math.random()
    const toast = { id, message, ...opts }
    setToasts((s) => [toast, ...s])
    const duration = opts.duration ?? 6000
    setTimeout(() => {
      setToasts((s) => s.filter((t) => t.id !== id))
    }, duration)
  }

  const value = useMemo(() => ({ show }), [])

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed top-6 right-6 z-50 flex flex-col items-end gap-3">
        {toasts.map((t) => (
          <div key={t.id} className="max-w-sm w-full bg-[var(--color-card)] border border-[var(--color-border)] shadow-lg rounded-xl p-3 text-sm text-[var(--color-foreground)]">
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
