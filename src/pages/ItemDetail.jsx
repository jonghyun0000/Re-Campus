import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Items, Users, Requests } from '../utils/storage.js'
import { STATUSES } from '../data/ecoTable.js'
import { formatPrice, formatKg, formatDate } from '../utils/format.js'
import Modal from '../components/Modal.jsx'
import { useApp } from '../App.jsx'

export default function ItemDetail() {
  const { id } = useParams()
  const nav = useNavigate()
  const { currentUser, showToast, refresh, tick } = useApp()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { item, owner, requestsOfItem, myReq } = useMemo(() => {
    const item = Items.all().find(x => x.id === id)
    const owner = item ? Users.all().find(u => u.id === item.userId) : null
    const requestsOfItem = Requests.all().filter(r => r.itemId === id)
    const myReq = currentUser ? requestsOfItem.find(r => r.requesterId === currentUser.id) : null
    return { item, owner, requestsOfItem, myReq }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, currentUser, tick])

  if (!item) return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <div className="text-2xl font-extrabold">존재하지 않는 물품입니다</div>
      <Link to="/items" className="btn-primary mt-4 inline-flex">목록으로</Link>
    </div>
  )

  const status = STATUSES.find(s => s.key === item.status)
  const isOwner = currentUser?.id === item.userId

  const apply = () => {
    if (!currentUser) return nav('/login')
    if (isOwner) return showToast('본인 물품에는 신청할 수 없어요', 'error')
    if (myReq) return showToast('이미 신청한 물품입니다', 'info')
    if (item.status !== 'available') return showToast('현재 신청할 수 없는 상태예요', 'error')
    const newReq = {
      id: 'r' + Date.now(),
      itemId: item.id, requesterId: currentUser.id, ownerId: item.userId,
      status: 'pending', createdAt: new Date().toISOString(),
    }
    Requests.add(newReq)
    showToast('수령 신청을 보냈어요. 등록자 승인 후 거래 완료 시 환경 데이터로 적립됩니다.', 'success')
    refresh()
  }

  const acceptRequest = (reqId) => {
    Requests.update(reqId, { status: 'accepted' })
    Requests.all().filter(r => r.itemId === item.id && r.id !== reqId && r.status === 'pending')
      .forEach(r => Requests.update(r.id, { status: 'rejected' }))
    Items.update(item.id, { status: 'reserved' })
    showToast('신청을 수락하고 예약중 상태로 변경했어요', 'success')
    refresh()
  }

  const complete = () => {
    const accepted = Requests.all().find(r => r.itemId === item.id && r.status === 'accepted')
    if (accepted) Requests.update(accepted.id, { status: 'completed' })
    Items.update(item.id, { status: 'completed', completedAt: new Date().toISOString() })
    setConfirmOpen(false)
    showToast('거래 완료! 환경 절감량이 대시보드에 적립됐어요 🌱', 'success')
    refresh()
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <Link to="/items" className="text-sm text-brand-700 font-semibold">← 목록으로</Link>

      <div className="mt-3 card overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="bg-slate-100 aspect-[4/3]">
            {item.imageUrl
              ? <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover"
                  onError={(e)=>{e.currentTarget.style.display='none'}}/>
              : <div className="w-full h-full grid place-items-center muted">이미지 없음</div>}
          </div>
          <div className="p-6 md:p-8">
            <div className="flex items-center gap-2">
              <span className={`chip ${status.color}`}>{status.label}</span>
              <span className="chip bg-slate-100 text-slate-600">{item.category}</span>
              <span className="chip bg-slate-100 text-slate-600">{item.condition}</span>
              {item.transactionType === '나눔' && <span className="chip bg-emerald-600 text-white">나눔</span>}
            </div>
            <h1 className="mt-3 text-2xl md:text-3xl font-extrabold text-slate-900">{item.title}</h1>
            <div className="mt-1 text-brand-700 text-2xl font-extrabold">{formatPrice(item.price, item.transactionType)}</div>

            <div className="mt-4 text-slate-700 whitespace-pre-wrap">{item.description}</div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-brand-50 p-3">
                <div className="text-xs text-brand-700 font-semibold">예상 탄소 절감량</div>
                <div className="text-xl font-extrabold text-brand-800">{formatKg(item.carbonReductionKg)}</div>
              </div>
              <div className="rounded-xl bg-emerald-50 p-3">
                <div className="text-xs text-emerald-700 font-semibold">예상 폐기물 감소량</div>
                <div className="text-xl font-extrabold text-emerald-800">{formatKg(item.wasteReductionKg)}</div>
              </div>
            </div>

            <div className="mt-5 text-sm muted">
              등록자 · <span className="font-semibold text-slate-700">{owner?.name}</span> ({owner?.school})
              <span className="mx-2">·</span> 등록일 {formatDate(item.createdAt)}
            </div>

            {/* ACTIONS */}
            <div className="mt-6 flex flex-wrap gap-2">
              {!isOwner && (
                <button onClick={apply} className="btn-primary"
                  disabled={item.status !== 'available' || !!myReq}>
                  {myReq ? '신청 완료' : '수령 신청'}
                </button>
              )}
              {isOwner && item.status !== 'completed' && (
                <button onClick={() => setConfirmOpen(true)} className="btn-primary">거래 완료 처리</button>
              )}
              {isOwner && item.status === 'completed' && (
                <span className="chip bg-slate-100 text-slate-600">이미 완료된 거래입니다</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* OWNER VIEW: REQUESTS */}
      {isOwner && (
        <div className="mt-6 card p-5">
          <div className="font-bold text-slate-900 mb-3">신청자 관리</div>
          {requestsOfItem.length === 0 ? (
            <div className="muted text-sm">아직 신청자가 없어요.</div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {requestsOfItem.map(r => {
                const u = Users.all().find(x => x.id === r.requesterId)
                return (
                  <li key={r.id} className="py-3 flex items-center justify-between">
                    <div className="text-sm">
                      <div className="font-semibold">{u?.name} <span className="muted">({u?.school})</span></div>
                      <div className="muted text-xs">신청일 {formatDate(r.createdAt)} · 상태 {r.status}</div>
                    </div>
                    {r.status === 'pending' && item.status === 'available' && (
                      <button onClick={() => acceptRequest(r.id)} className="btn-secondary">수락</button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      <Modal open={confirmOpen} onClose={() => setConfirmOpen(false)} title="거래 완료 처리하시겠어요?"
        footer={<>
          <button className="btn-secondary" onClick={() => setConfirmOpen(false)}>취소</button>
          <button className="btn-primary" onClick={complete}>완료 처리</button>
        </>}>
        거래 완료 시 카테고리 기준으로 <b>탄소 {formatKg(item.carbonReductionKg)}</b>,
        <b> 폐기물 {formatKg(item.wasteReductionKg)}</b> 절감량이 대시보드에 적립됩니다.
      </Modal>
    </div>
  )
}
