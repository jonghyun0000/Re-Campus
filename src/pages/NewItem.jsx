import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, CONDITIONS } from '../data/ecoTable.js'
import { getEcoByCategory } from '../utils/calcEco.js'
import { validateItem } from '../utils/validation.js'
import { Items } from '../utils/storage.js'
import { useApp } from '../App.jsx'
import { formatKg } from '../utils/format.js'

const sample = 'https://images.unsplash.com/photo-1481349518771-20055b2a7b24?w=600'

export default function NewItem() {
  const nav = useNavigate()
  const { currentUser, showToast, refresh } = useApp()
  const [form, setForm] = useState({
    title:'', description:'', category:'', condition:'', transactionType:'나눔',
    price: 0, imageUrl: '',
  })
  const [errors, setErrors] = useState({})

  const eco = useMemo(() => form.category ? getEcoByCategory(form.category) : null, [form.category])

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const onFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return
    const reader = new FileReader()
    reader.onload = () => set('imageUrl', reader.result)
    reader.readAsDataURL(f)
  }

  const submit = (e) => {
    e.preventDefault()
    const errs = validateItem(form)
    if (Object.keys(errs).length) { setErrors(errs); showToast('입력값을 확인해 주세요', 'error'); return }
    const eco2 = getEcoByCategory(form.category)
    const item = {
      id: 'i' + Date.now(),
      userId: currentUser.id,
      title: form.title.trim(),
      description: form.description.trim(),
      category: form.category,
      condition: form.condition,
      transactionType: form.transactionType,
      price: form.transactionType === '나눔' ? 0 : Number(form.price) || 0,
      imageUrl: form.imageUrl || sample,
      status: 'available',
      wasteReductionKg: eco2.wasteReductionKg,
      carbonReductionKg: eco2.carbonReductionKg,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }
    Items.add(item)
    showToast('등록 완료! 거래가 완료되면 환경 데이터로 적립됩니다 🌱', 'success')
    refresh()
    nav('/items/' + item.id)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="chip bg-brand-50 text-brand-700">REGISTER</div>
      <h1 className="section-title mt-2">물품 등록</h1>
      <p className="muted mt-1">등록한 물품의 거래가 완료되면, 환경 절감량이 자동으로 데이터에 합산됩니다.</p>

      <form onSubmit={submit} className="card p-6 mt-6 grid gap-4">
        <div>
          <label className="label">제목</label>
          <input className="input" value={form.title} onChange={e=>set('title', e.target.value)} placeholder="예: 경영학원론 7판" />
          {errors.title && <p className="text-red-600 text-xs mt-1">{errors.title}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">카테고리</label>
            <select className="input" value={form.category} onChange={e=>set('category', e.target.value)}>
              <option value="">선택</option>
              {CATEGORIES.map(c=> <option key={c}>{c}</option>)}
            </select>
            {errors.category && <p className="text-red-600 text-xs mt-1">{errors.category}</p>}
          </div>
          <div>
            <label className="label">상태</label>
            <select className="input" value={form.condition} onChange={e=>set('condition', e.target.value)}>
              <option value="">선택</option>
              {CONDITIONS.map(c=> <option key={c}>{c}</option>)}
            </select>
            {errors.condition && <p className="text-red-600 text-xs mt-1">{errors.condition}</p>}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">거래 유형</label>
            <div className="flex gap-2">
              {['나눔','저가거래'].map(t => (
                <button type="button" key={t}
                  onClick={()=>set('transactionType', t)}
                  className={`btn ${form.transactionType===t ? 'bg-brand-600 text-white' : 'bg-white border border-slate-200 text-slate-700'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">가격 (원)</label>
            <input type="number" className="input" value={form.price}
              disabled={form.transactionType==='나눔'}
              onChange={e=>set('price', e.target.value)} placeholder="0" />
            {errors.price && <p className="text-red-600 text-xs mt-1">{errors.price}</p>}
          </div>
        </div>

        <div>
          <label className="label">설명</label>
          <textarea className="input min-h-[120px]" value={form.description} onChange={e=>set('description', e.target.value)} placeholder="상태, 사용 기간, 거래 가능 시간 등을 적어주세요" />
          {errors.description && <p className="text-red-600 text-xs mt-1">{errors.description}</p>}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">이미지 업로드</label>
            <input type="file" accept="image/*" className="input" onChange={onFile} />
          </div>
          <div>
            <label className="label">또는 이미지 URL</label>
            <input className="input" value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
              onChange={e=>set('imageUrl', e.target.value)} placeholder="https://..." />
          </div>
        </div>

        {form.imageUrl && (
          <img src={form.imageUrl} alt="미리보기" className="rounded-xl border max-h-56 object-contain bg-slate-50"
            onError={(e)=>{e.currentTarget.style.display='none'}} />
        )}

        {eco && (
          <div className="rounded-xl bg-brand-50 border border-brand-100 p-4 grid sm:grid-cols-2 gap-3">
            <div>
              <div className="text-xs text-brand-700 font-semibold">예상 탄소 절감량</div>
              <div className="text-2xl font-extrabold text-brand-800">{formatKg(eco.carbonReductionKg)}</div>
            </div>
            <div>
              <div className="text-xs text-emerald-700 font-semibold">예상 폐기물 감소량</div>
              <div className="text-2xl font-extrabold text-emerald-800">{formatKg(eco.wasteReductionKg)}</div>
            </div>
            <div className="sm:col-span-2 text-xs muted">* 데모용 카테고리 기준 추정값입니다.</div>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <button type="button" className="btn-secondary" onClick={()=>nav(-1)}>취소</button>
          <button type="submit" className="btn-primary">등록하기</button>
        </div>
      </form>
    </div>
  )
}
