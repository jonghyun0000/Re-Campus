export default function ChartCard({ title, subtitle, children, action }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <div className="font-bold text-slate-900">{title}</div>
          {subtitle && <div className="text-xs muted mt-0.5">{subtitle}</div>}
        </div>
        {action}
      </div>
      <div className="h-64">{children}</div>
    </div>
  )
}
