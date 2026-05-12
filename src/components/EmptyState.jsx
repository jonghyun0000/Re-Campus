export default function EmptyState({ title = '아직 데이터가 없어요', description, action }) {
  return (
    <div className="card p-10 text-center fade-in">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-brand-50 text-brand-700 grid place-items-center mb-3">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 7h16M4 12h16M4 17h10"/></svg>
      </div>
      <div className="font-bold text-slate-900">{title}</div>
      {description && <div className="muted text-sm mt-1">{description}</div>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}
