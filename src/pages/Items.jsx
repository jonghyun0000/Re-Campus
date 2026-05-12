import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import ItemCard from '../components/ItemCard.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { Items as ItemStore, Users } from '../utils/storage.js'
import { CATEGORIES, STATUSES } from '../data/ecoTable.js'
import { useApp } from '../App.jsx'

export default function Items() {
  const { tick } = useApp()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('all')
  const [st, setSt] = useState('all')
  const [type, setType] = useState('all')

  const { items, users } = useMemo(() => ({
    items: ItemStore.all(),
    users: Users.all(),
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [tick])

  const filtered = useMemo(() => {
    return items
      .filter(i => i.status !== 'hidden')
      .filter(i => cat === 'all' || i.category === cat)
      .filter(i => st === 'all' || i.status === st)
      .filter(i => type === 'all' || i.transactionType === type)
      .filter(i => {
        if (!q.trim()) return true
        const s = q.toLowerCase()
        return i.title.toLowerCase().includes(s) || i.description.toLowerCase().includes(s)
      })
  }, [items, q, cat, st, type])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-6">
        <div>
          <div className="chip bg-brand-50 text-brand-700">EXPLORE</div>
          <h1 className="section-title mt-2">캠퍼스 자원 둘러보기</h1>
          <p className="muted mt-1">필요한 물품을 찾아보고, 학교 단위의 재사용 임팩트에 동참하세요.</p>
        </div>
        <Link to="/items/new" className="btn-primary self-start md:self-auto">+ 물품 등록</Link>
      </div>

      {/* FILTERS */}
      <div className="card p-4 mb-6">
        <div className="grid md:grid-cols-12 gap-3">
          <div className="md:col-span-5">
            <label className="label">검색</label>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="제목·설명 검색" className="input" />
          </div>
          <div className="md:col-span-3">
            <label className="label">카테고리</label>
            <select value={cat} onChange={e=>setCat(e.target.value)} className="input">
              <option value="all">전체</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">상태</label>
            <select value={st} onChange={e=>setSt(e.target.value)} className="input">
              <option value="all">전체</option>
              {STATUSES.filter(s=>s.key!=='hidden').map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">거래 유형</label>
            <select value={type} onChange={e=>setType(e.target.value)} className="input">
              <option value="all">전체</option>
              <option value="나눔">나눔</option>
              <option value="저가거래">저가거래</option>
            </select>
          </div>
        </div>
        <div className="mt-3 text-xs muted">총 <b className="text-slate-700">{filtered.length}</b>건</div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="조건에 맞는 물품이 없어요" description="필터를 조정하거나 직접 물품을 등록해 보세요."
          action={<Link to="/items/new" className="btn-primary">+ 물품 등록</Link>} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(i => (
            <ItemCard key={i.id} item={i} owner={users.find(u => u.id === i.userId)} />
          ))}
        </div>
      )}
    </div>
  )
}
