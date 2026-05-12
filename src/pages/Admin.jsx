import { useMemo, useState } from 'react'
import { Items, Users, Requests, resetAll } from '../utils/storage.js'
import { STATUSES } from '../data/ecoTable.js'
import { formatDate } from '../utils/format.js'
import Modal from '../components/Modal.jsx'
import { useApp } from '../App.jsx'

export default function Admin() {
  const { showToast, refresh, tick } = useApp()
  const [confirmReset, setConfirmReset] = useState(false)

  const { users, items } = useMemo(() => ({
    users: Users.all(), items: Items.all(),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [tick])

  const toggleVerify = (u) => {
    const next = u.verificationStatus === 'approved' ? 'pending' : 'approved'
    Users.update(u.id, { verificationStatus: next })
    showToast(`${u.name} 인증 상태 → ${next}`, 'success')
    refresh()
  }

  const toggleHide = (i) => {
    const next = i.status === 'hidden' ? 'available' : 'hidden'
    Items.update(i.id, { status: next })
    showToast(`'${i.title}' ${next === 'hidden' ? '숨김' : '복구'} 처리`, 'success')
    refresh()
  }

  const doReset = () => {
    resetAll()
    setConfirmReset(false)
    showToast('데이터를 초기 시연 상태로 되돌렸어요', 'success')
    refresh()
    setTimeout(() => location.reload(), 600)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="chip bg-red-50 text-red-700">ADMIN</div>
          <h1 className="section-title mt-2">관리자 페이지</h1>
          <p className="muted mt-1">학교 인증 승인 / 게시물 관리 / 데이터 초기화</p>
        </div>
        <button className="btn-danger" onClick={()=>setConfirmReset(true)}>데이터 초기화</button>
      </div>

      <section className="card mt-2">
        <div className="p-5 border-b border-slate-100 font-bold">사용자 관리 ({users.length})</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">이름</th>
                <th className="text-left px-4 py-3">이메일</th>
                <th className="text-left px-4 py-3">학교</th>
                <th className="text-left px-4 py-3">권한</th>
                <th className="text-left px-4 py-3">인증</th>
                <th className="text-right px-4 py-3">액션</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{u.name}</td>
                  <td className="px-4 py-3 muted">{u.email}</td>
                  <td className="px-4 py-3">{u.school}</td>
                  <td className="px-4 py-3">
                    <span className={`chip ${u.role==='admin'?'bg-red-100 text-red-700':'bg-slate-100 text-slate-700'}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`chip ${u.verificationStatus==='approved'?'bg-brand-100 text-brand-700':'bg-amber-100 text-amber-700'}`}>
                      {u.verificationStatus === 'approved' ? '승인' : '대기'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button className="btn-secondary text-xs" onClick={()=>toggleVerify(u)}>
                      {u.verificationStatus==='approved' ? '대기로 변경' : '승인하기'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="card mt-6">
        <div className="p-5 border-b border-slate-100 font-bold">게시물 관리 ({items.length})</div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">제목</th>
                <th className="text-left px-4 py-3">카테고리</th>
                <th className="text-left px-4 py-3">등록자</th>
                <th className="text-left px-4 py-3">상태</th>
                <th className="text-left px-4 py-3">등록일</th>
                <th className="text-right px-4 py-3">액션</th>
              </tr>
            </thead>
            <tbody>
              {items.map(i => {
                const s = STATUSES.find(x => x.key === i.status)
                const owner = users.find(u => u.id === i.userId)
                return (
                  <tr key={i.id} className="border-t border-slate-100">
                    <td className="px-4 py-3 font-semibold line-clamp-1">{i.title}</td>
                    <td className="px-4 py-3">{i.category}</td>
                    <td className="px-4 py-3">{owner?.name} <span className="muted">({owner?.school})</span></td>
                    <td className="px-4 py-3"><span className={`chip ${s?.color}`}>{s?.label}</span></td>
                    <td className="px-4 py-3 muted">{formatDate(i.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button className={`btn ${i.status==='hidden'?'bg-brand-600 text-white':'bg-white border border-red-200 text-red-700 hover:bg-red-50'} text-xs`}
                        onClick={()=>toggleHide(i)}>
                        {i.status==='hidden' ? '복구' : '숨김 처리'}
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </section>

      <Modal open={confirmReset} onClose={()=>setConfirmReset(false)} title="데이터를 초기화할까요?"
        footer={<>
          <button className="btn-secondary" onClick={()=>setConfirmReset(false)}>취소</button>
          <button className="btn-danger" onClick={doReset}>초기화 실행</button>
        </>}>
        모든 사용자/물품/신청 데이터가 시연용 초기 상태로 되돌아갑니다. 발표 직전에 사용하세요.
      </Modal>
    </div>
  )
}
