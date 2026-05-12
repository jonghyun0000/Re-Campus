import { Link } from 'react-router-dom'
import { STATUSES } from '../data/ecoTable.js'
import { formatPrice, formatKg } from '../utils/format.js'

export default function ItemCard({ item, owner }) {
  const status = STATUSES.find(s => s.key === item.status) || STATUSES[0]
  return (
    <Link to={`/items/${item.id}`} className="card group hover:shadow-soft hover:-translate-y-0.5 transition fade-in">
      <div className="relative aspect-[4/3] bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition" loading="lazy"
            onError={(e)=>{e.currentTarget.style.display='none'}} />
        ) : (
          <div className="w-full h-full grid place-items-center text-slate-400 text-sm">이미지 없음</div>
        )}
        <span className={`absolute top-3 left-3 chip ${status.color} backdrop-blur`}>{status.label}</span>
        {item.transactionType === '나눔' && (
          <span className="absolute top-3 right-3 chip bg-emerald-600 text-white">나눔</span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 text-xs muted mb-1">
          <span className="chip bg-slate-100 text-slate-600">{item.category}</span>
          <span>· {item.condition}</span>
        </div>
        <div className="font-bold text-slate-900 line-clamp-1">{item.title}</div>
        <div className="mt-1 text-brand-700 font-extrabold">{formatPrice(item.price, item.transactionType)}</div>
        <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="muted">{owner?.school || '학교 정보'}</span>
          <span className="text-brand-700 font-semibold">CO₂ -{formatKg(item.carbonReductionKg)}</span>
        </div>
      </div>
    </Link>
  )
}
