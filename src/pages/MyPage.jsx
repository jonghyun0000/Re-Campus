import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Items, Requests } from '../utils/storage.js'
import { sumEco } from '../utils/calcEco.js'
import { formatKg, formatCount, formatDate, formatPrice } from '../utils/format.js'
import StatCard from '../components/StatCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { STATUSES } from '../data/ecoTable.js'
import { useApp } from '../App.jsx'

export default function MyPage() {
  const { currentUser, tick } = useApp()

  const data = useMemo(() => {
    const all = Items.all()
    const reqs = Requests.all()
    const mine = all.filter(i => i.userId === currentUser.id)
    const completedMine = mine.filter(i => i.status === 'completed')
    const myReqs = reqs.filter(r => r.requesterId === currentUser.id)
    const requestedItems = myReqs.map(r => ({ req: r, item: all.find(i => i.id === r.itemId) })).filter(x => x.item)
    const receivedCompleted = requestedItems.filter(x => x.req.status === 'completed').map(x => x.item)
    const eco = sumEco([...completedMine, ...receivedCompleted])
    return { mine, completedMine, requestedItems, eco }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, tick])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white grid place-items-center text-lg font-bold">{currentUser.name[0]}</div>
        <div>
          <div className="font-extrabold text-slate-900 text-lg">{currentUser.name}</div>
          <div className="muted text-sm">{currentUser.school} · 인증 {currentUser.verificationStatus === 'approved' ? '✅ 완료' : '⏳ 대기'}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="나의 등록 물품" value={formatCount(data.mine.length) + ' 건'} icon="📦" />
        <StatCard label="나의 거래 완료" value={formatCount(data.completedMine.length) + ' 건'} icon="✅" />
        <StatCard label="나의 탄소 기여" value={formatKg(data.eco.carbon)} icon="🌳" />
        <StatCard label="나의 폐기물 감소" value={formatKg(data.eco.waste)} icon="♻️" accent="indigo" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-extrabold">내가 등록한 물품</h2>
            <Link to="/items/new" className="btn-secondary text-sm">+ 등록</Link>
          </div>
          {data.mine.length === 0 ? (
            <EmptyState description="등록한 물품이 없습니다." action={<Link to="/items/new" className="btn-primary">+ 첫 물품 등록</Link>} />
          ) : (
            <ul className="grid gap-2">
              {data.mine.map(i => {
                const s = STATUSES.find(x => x.key === i.status)
                return (
                  <li key={i.id}>
                    <Link to={`/items/${i.id}`} className="card p-4 flex items-center gap-4 hover:shadow-soft">
                      <img src={i.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-100" onError={(e)=>{e.currentTarget.style.visibility='hidden'}}/>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 line-clamp-1">{i.title}</div>
                        <div className="muted text-xs">{i.category} · {formatDate(i.createdAt)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-brand-700 font-bold">{formatPrice(i.price, i.transactionType)}</div>
                        <span className={`chip mt-1 ${s.color}`}>{s.label}</span>
                      </div>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>

        <section>
          <h2 className="text-lg font-extrabold mb-3">내가 신청한 물품</h2>
          {data.requestedItems.length === 0 ? (
            <EmptyState description="신청한 물품이 없습니다." action={<Link to="/items" className="btn-primary">둘러보기</Link>} />
          ) : (
            <ul className="grid gap-2">
              {data.requestedItems.map(({req, item}) => {
                const s = STATUSES.find(x => x.key === item.status)
                return (
                  <li key={req.id}>
                    <Link to={`/items/${item.id}`} className="card p-4 flex items-center gap-4 hover:shadow-soft">
                      <img src={item.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover bg-slate-100" onError={(e)=>{e.currentTarget.style.visibility='hidden'}}/>
                      <div className="flex-1">
                        <div className="font-semibold text-slate-900 line-clamp-1">{item.title}</div>
                        <div className="muted text-xs">신청일 {formatDate(req.createdAt)} · 상태 {req.status}</div>
                      </div>
                      <span className={`chip ${s.color}`}>{s.label}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}
