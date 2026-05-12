export default function StatCard({ label, value, sub, icon, accent = 'brand' }) {
  const ring = accent === 'brand' ? 'from-brand-400 to-brand-700' : 'from-sky-400 to-indigo-600'
  return (
    <div className="card p-5 fade-in">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-500">{label}</div>
        <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${ring} text-white grid place-items-center`}>
          {icon}
        </div>
      </div>
      <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{value}</div>
      {sub && <div className="mt-1 text-xs muted">{sub}</div>}
    </div>
  )
}
