import { Link } from 'react-router-dom'
import { useMemo } from 'react'
import StatCard from '../components/StatCard.jsx'
import { Items, Users } from '../utils/storage.js'
import { sumEco, friendlyCarbon } from '../utils/calcEco.js'
import { formatCount, formatKg } from '../utils/format.js'
import { useApp } from '../App.jsx'

export default function Home() {
  const { tick } = useApp()
  const data = useMemo(() => {
    const items = Items.all()
    const completed = items.filter(i => i.status === 'completed')
    const { waste, carbon } = sumEco(completed)
    const schools = new Set(Users.all().map(u => u.school))
    return {
      reuseCount: completed.length,
      waste, carbon,
      schools: schools.size,
      friendly: friendlyCarbon(carbon),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-emerald-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-200/40 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-emerald-200/40 blur-3xl" />
        <div className="relative max-w-6xl mx-auto px-4 py-16 md:py-24">
          <div className="inline-flex items-center gap-2 chip bg-white border border-brand-100 text-brand-700">
            🌱 Campus ESG Data Platform
          </div>
          <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            버려지는 캠퍼스 자원을 <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-brand-600 to-emerald-500 bg-clip-text text-transparent">데이터로 증명하는 학교 ESG</span>
          </h1>
          <p className="mt-4 max-w-2xl text-slate-600 md:text-lg">
            Re:Campus는 전공책·의류·생활용품·전자기기를 학생 간 재사용으로 연결하고,
            거래 결과를 <b>탄소 절감량</b>과 <b>폐기물 감소량</b>으로 시각화합니다.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            <Link to="/items/new" className="btn-primary">+ 물품 등록하기</Link>
            <Link to="/items" className="btn-secondary">둘러보기</Link>
            <Link to="/dashboard" className="btn-ghost border border-slate-200 bg-white">데이터 대시보드 보기 →</Link>
          </div>

          {/* HERO STATS */}
          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <StatCard label="누적 재사용 건수" value={formatCount(data.reuseCount) + ' 건'} sub="거래 완료 기준"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-3-6.7"/><path d="M21 3v6h-6"/></svg>} />
            <StatCard label="누적 탄소 절감량" value={formatKg(data.carbon)} sub={`승용차 약 ${data.friendly.km}km 절감 효과`}
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3v18M3 12h18"/></svg>} />
            <StatCard label="누적 폐기물 감소량" value={formatKg(data.waste)} sub="매립/소각 회피량"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>} />
            <StatCard label="참여 학교" value={formatCount(data.schools) + ' 곳'} sub="멀티 캠퍼스 확장 중" accent="indigo"
              icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 21h18M5 21V9l7-4 7 4v12"/></svg>} />
          </div>
        </div>
      </section>

      {/* HOW */}
      <section className="max-w-6xl mx-auto px-4 py-14">
        <div className="text-center mb-8">
          <div className="chip bg-brand-50 text-brand-700">HOW IT WORKS</div>
          <h2 className="section-title mt-2">거래가 끝나면, 환경 데이터가 쌓입니다</h2>
          <p className="muted mt-1">단순한 중고거래가 아니라, 학교 차원의 자원 순환 성과를 측정합니다.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { t: '① 등록', d: '학생이 전공책·의류·생활용품·전자기기를 등록합니다.', icon: '📤' },
            { t: '② 연결', d: '같은 캠퍼스 학생끼리 신청·수령으로 재사용을 연결합니다.', icon: '🔗' },
            { t: '③ 데이터화', d: '거래 완료 시 카테고리 기준으로 탄소·폐기물 절감량이 자동 적립됩니다.', icon: '📊' },
          ].map(s => (
            <div key={s.t} className="card p-6">
              <div className="text-3xl">{s.icon}</div>
              <div className="mt-2 font-extrabold text-slate-900">{s.t}</div>
              <p className="muted mt-1 text-sm">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* IMPACT */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <div className="card p-8 md:p-10 bg-gradient-to-br from-brand-600 to-emerald-700 text-white">
          <div className="grid md:grid-cols-3 gap-6 items-center">
            <div className="md:col-span-2">
              <div className="text-sm font-semibold opacity-80">IMPACT TRANSLATION</div>
              <h3 className="text-2xl md:text-3xl font-extrabold mt-1">
                지금까지의 활동은 소나무 <span className="underline decoration-emerald-200 underline-offset-4">{data.friendly.trees}그루</span>가 연간 흡수하는 탄소량과 비슷합니다.
              </h3>
              <p className="opacity-90 mt-2">승용차 약 {data.friendly.km}km 주행 배출량 절감 / 폐기물 {formatKg(data.waste)} 매립·소각 회피</p>
            </div>
            <Link to="/dashboard" className="btn bg-white text-brand-700 hover:bg-brand-50 justify-center">대시보드에서 자세히 보기 →</Link>
          </div>
        </div>
      </section>
    </div>
  )
}
