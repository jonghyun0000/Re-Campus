import { useNavigate } from 'react-router-dom'
import { Users } from '../utils/storage.js'
import { useApp } from '../App.jsx'

export default function Login() {
  const nav = useNavigate()
  const { login, currentUser } = useApp()
  const users = Users.all()

  const choose = (id) => {
    login(id)
    nav('/')
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <div className="chip bg-brand-50 text-brand-700">DEMO LOGIN</div>
        <h1 className="section-title mt-2">데모 사용자로 시작하기</h1>
        <p className="muted mt-1">발표용 시연을 위해 비밀번호 없이 사용자 전환이 가능합니다.</p>
        {currentUser && <p className="text-sm mt-2">현재 로그인: <b>{currentUser.name}</b></p>}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {users.map(u => (
          <button key={u.id} onClick={()=>choose(u.id)}
            className={`card p-5 text-left hover:shadow-soft hover:-translate-y-0.5 transition ${currentUser?.id===u.id?'ring-2 ring-brand-500':''}`}>
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl grid place-items-center text-white font-bold ${u.role==='admin'?'bg-red-500':'bg-brand-500'}`}>{u.name[0]}</div>
              <div>
                <div className="font-bold text-slate-900">{u.name} {u.role==='admin' && <span className="chip bg-red-100 text-red-700 ml-1">관리자</span>}</div>
                <div className="muted text-xs">{u.email}</div>
                <div className="muted text-xs">{u.school} · 인증 {u.verificationStatus}</div>
              </div>
            </div>
          </button>
        ))}
      </div>
      <p className="text-xs muted text-center mt-6">* 데모 환경 — 실서비스가 아닙니다.</p>
    </div>
  )
}
