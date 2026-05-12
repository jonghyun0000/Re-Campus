import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useApp } from '../App.jsx'

const NavItem = ({ to, children }) => (
  <NavLink to={to} className={({isActive}) =>
    `px-3 py-2 rounded-lg text-sm font-semibold transition ${isActive ? 'text-brand-700 bg-brand-50' : 'text-slate-600 hover:text-brand-700 hover:bg-brand-50/60'}`
  }>{children}</NavLink>
)

export default function Navbar() {
  const { currentUser, logout } = useApp()
  const [open, setOpen] = useState(false)
  const nav = useNavigate()

  return (
    <header className="sticky top-0 z-30 bg-white/85 backdrop-blur border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-400 to-brand-700 grid place-items-center text-white font-black">R</div>
          <div className="leading-tight">
            <div className="font-extrabold text-slate-900">Re:Campus</div>
            <div className="text-[10px] text-brand-700 font-semibold tracking-wide">CAMPUS ESG DATA PLATFORM</div>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          <NavItem to="/">홈</NavItem>
          <NavItem to="/items">둘러보기</NavItem>
          <NavItem to="/dashboard">대시보드</NavItem>
          {currentUser && <NavItem to="/my">마이</NavItem>}
          {currentUser?.role === 'admin' && <NavItem to="/admin">관리자</NavItem>}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {currentUser ? (
            <>
              <button onClick={() => nav('/items/new')} className="btn-primary">+ 물품 등록</button>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-100">
                <div className="w-7 h-7 rounded-full bg-brand-500 text-white grid place-items-center text-xs font-bold">{currentUser.name[0]}</div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-800">{currentUser.name}</div>
                  <div className="text-slate-500">{currentUser.school}</div>
                </div>
              </div>
              <button onClick={logout} className="btn-ghost text-sm">로그아웃</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary">데모 로그인</Link>
          )}
        </div>

        <button onClick={() => setOpen(o => !o)} className="md:hidden btn-ghost" aria-label="menu">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-slate-100 bg-white">
          <div className="max-w-6xl mx-auto px-4 py-3 grid gap-1">
            <NavItem to="/">홈</NavItem>
            <NavItem to="/items">둘러보기</NavItem>
            <NavItem to="/dashboard">대시보드</NavItem>
            {currentUser && <NavItem to="/my">마이</NavItem>}
            {currentUser?.role === 'admin' && <NavItem to="/admin">관리자</NavItem>}
            <div className="pt-2 flex gap-2">
              {currentUser ? (
                <>
                  <Link to="/items/new" className="btn-primary flex-1" onClick={() => setOpen(false)}>+ 물품 등록</Link>
                  <button onClick={() => { logout(); setOpen(false) }} className="btn-secondary">로그아웃</button>
                </>
              ) : <Link to="/login" className="btn-primary flex-1" onClick={() => setOpen(false)}>데모 로그인</Link>}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
