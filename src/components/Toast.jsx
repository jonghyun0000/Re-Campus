import { useEffect } from 'react'

export default function Toast({ message, type = 'info', onClose }) {
  useEffect(() => {
    const t = setTimeout(() => onClose?.(), 2400)
    return () => clearTimeout(t)
  }, [onClose])

  const color = {
    success: 'bg-brand-600',
    error:   'bg-red-600',
    info:    'bg-slate-800',
  }[type] || 'bg-slate-800'

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 fade-in">
      <div className={`${color} text-white text-sm font-semibold px-4 py-2.5 rounded-xl shadow-soft`}>
        {message}
      </div>
    </div>
  )
}
