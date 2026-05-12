import { useMemo } from 'react'
import { Items, Users } from '../utils/storage.js'
import { sumEco, friendlyCarbon } from '../utils/calcEco.js'
import { CATEGORIES } from '../data/ecoTable.js'
import { formatKg, formatCount } from '../utils/format.js'
import StatCard from '../components/StatCard.jsx'
import ChartCard from '../components/ChartCard.jsx'
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts'
import { useApp } from '../App.jsx'

const GREEN = ['#10b981', '#34d399', '#059669', '#6ee7b7', '#047857']

export default function Dashboard() {
  const { tick } = useApp()

  const d = useMemo(() => {
    const items = Items.all()
    const users = Users.all()
    const completed = items.filter(i => i.status === 'completed')
    const eco = sumEco(completed)
    const schools = Array.from(new Set(users.map(u => u.school)))

    const bySchool = schools.map(s => {
      const usersOfSchool = users.filter(u => u.school === s).map(u => u.id)
      const itemsOfSchool = completed.filter(i => usersOfSchool.includes(i.userId))
      const e = sumEco(itemsOfSchool)
      return { name: s.replace('학교', ''), count: itemsOfSchool.length, carbon: +e.carbon.toFixed(1), waste: +e.waste.toFixed(1) }
    })

    const byCategory = CATEGORIES.map(c => {
      const itemsOfCat = completed.filter(i => i.category === c)
      const e = sumEco(itemsOfCat)
      return { name: c, count: itemsOfCat.length, carbon: +e.carbon.toFixed(1), waste: +e.waste.toFixed(1) }
    })

    // 최근 6개월 추이
    const now = new Date()
    const months = []
    for (let m = 5; m >= 0; m--) {
      const dt = new Date(now.getFullYear(), now.getMonth() - m, 1)
      months.push({ key: `${dt.getFullYear()}-${String(dt.getMonth()+1).padStart(2,'0')}`,
        label: `${dt.getMonth()+1}월`, y: dt.getFullYear(), m: dt.getMonth() })
    }
    const monthly = months.map(mo => {
      const inMonth = completed.filter(i => {
        if (!i.completedAt) return false
        const cd = new Date(i.completedAt)
        return cd.getFullYear() === mo.y && cd.getMonth() === mo.m
      })
      const e = sumEco(inMonth)
      return { name: mo.label, count: inMonth.length, carbon: +e.carbon.toFixed(1) }
    })

    return {
      reuseCount: completed.length,
      eco,
      schoolCount: schools.length,
      bySchool, byCategory, monthly,
      friendly: friendlyCarbon(eco.carbon),
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick])

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="chip bg-brand-50 text-brand-700">DATA DASHBOARD</div>
      <h1 className="section-title mt-2">캠퍼스 자원 순환 데이터</h1>
      <p className="muted mt-1">거래 완료된 모든 활동을 학교 단위 ESG 성과로 시각화합니다.</p>

      {/* TOP STATS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
        <StatCard label="누적 재사용 건수" value={formatCount(d.reuseCount)+' 건'} sub="거래 완료 기준" icon="🔁" />
        <StatCard label="누적 탄소 절감량" value={formatKg(d.eco.carbon)} sub={`승용차 약 ${d.friendly.km}km 절감`} icon="🌿" />
        <StatCard label="누적 폐기물 감소량" value={formatKg(d.eco.waste)} sub="매립·소각 회피" icon="♻️" accent="indigo" />
        <StatCard label="참여 학교" value={formatCount(d.schoolCount)+' 곳'} sub="멀티 캠퍼스" icon="🏫" accent="indigo" />
      </div>

      {/* IMPACT BANNER */}
      <div className="card mt-6 p-6 bg-gradient-to-r from-brand-50 to-emerald-50 border-brand-100">
        <div className="text-sm font-semibold text-brand-700">IMPACT TRANSLATION</div>
        <div className="mt-1 text-lg md:text-xl font-extrabold text-slate-900">
          🌳 소나무 약 <span className="text-brand-700">{d.friendly.trees}그루</span>가 1년간 흡수하는 탄소량과 유사 · 🚗 승용차 약 <span className="text-brand-700">{d.friendly.km}km</span> 주행 배출량 절감
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid lg:grid-cols-2 gap-4 mt-6">
        <ChartCard title="학교별 거래 완료 건수" subtitle="멀티 캠퍼스 비교">
          <ResponsiveContainer>
            <BarChart data={d.bySchool} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="count" fill="#10b981" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="학교별 탄소 절감량 (kg)" subtitle="누적 합산">
          <ResponsiveContainer>
            <BarChart data={d.bySchool} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Bar dataKey="carbon" fill="#059669" radius={[8,8,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="카테고리별 분포" subtitle="거래 완료 건수 비중">
          <ResponsiveContainer>
            <PieChart>
              <Pie data={d.byCategory} dataKey="count" nameKey="name" outerRadius={90} label>
                {d.byCategory.map((_, i) => <Cell key={i} fill={GREEN[i % GREEN.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="월별 추이 (최근 6개월)" subtitle="거래 완료 수 & 탄소 절감량">
          <ResponsiveContainer>
            <LineChart data={d.monthly} margin={{ left: -10, right: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" name="거래 수" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="carbon" name="탄소(kg)" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* CATEGORY TABLE */}
      <div className="card mt-6 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <div className="font-bold text-slate-900">카테고리별 상세</div>
          <div className="text-xs muted mt-0.5">거래 완료 기준 합산</div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="text-left px-4 py-3">카테고리</th>
                <th className="text-right px-4 py-3">거래 건수</th>
                <th className="text-right px-4 py-3">탄소 절감량</th>
                <th className="text-right px-4 py-3">폐기물 감소량</th>
              </tr>
            </thead>
            <tbody>
              {d.byCategory.map(c => (
                <tr key={c.name} className="border-t border-slate-100">
                  <td className="px-4 py-3 font-semibold">{c.name}</td>
                  <td className="px-4 py-3 text-right">{c.count}</td>
                  <td className="px-4 py-3 text-right text-brand-700 font-semibold">{formatKg(c.carbon)}</td>
                  <td className="px-4 py-3 text-right text-emerald-700 font-semibold">{formatKg(c.waste)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
