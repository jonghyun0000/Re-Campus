import { Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState, useCallback, createContext, useContext } from 'react'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Toast from './components/Toast.jsx'

import Home from './pages/Home.jsx'
import Items from './pages/Items.jsx'
import ItemDetail from './pages/ItemDetail.jsx'
import NewItem from './pages/NewItem.jsx'
import MyPage from './pages/MyPage.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Admin from './pages/Admin.jsx'
import Login from './pages/Login.jsx'

import { ensureSeed, Session, Users } from './utils/storage.js'

const AppCtx = createContext(null)
export const useApp = () => useContext(AppCtx)

export default function App() {
  const [currentUser, setCurrentUser] = useState(null)
  const [toast, setToast] = useState(null)
  const [tick, setTick] = useState(0)  // 데이터 변경 알림 트리거

  useEffect(() => {
    ensureSeed()
    const id = Session.get()
    if (id) {
      const u = Users.all().find(x => x.id === id)
      if (u) setCurrentUser(u)
    }
  }, [])

  const login = useCallback((userId) => {
    const u = Users.all().find(x => x.id === userId)
    if (!u) return
    Session.set(userId)
    setCurrentUser(u)
    showToast(`${u.name}님으로 로그인했어요`, 'success')
  }, [])

  const logout = useCallback(() => {
    Session.clear(); setCurrentUser(null)
    showToast('로그아웃 되었습니다', 'info')
  }, [])

  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type, id: Date.now() })
  }, [])

  const refresh = useCallback(() => setTick(t => t + 1), [])

  return (
    <AppCtx.Provider value={{ currentUser, login, logout, showToast, refresh, tick }}>
      <div className="min-h-screen flex flex-col bg-slate-50">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/items" element={<Items />} />
            <Route path="/items/new" element={currentUser ? <NewItem /> : <Navigate to="/login" />} />
            <Route path="/items/:id" element={<ItemDetail />} />
            <Route path="/my" element={currentUser ? <MyPage /> : <Navigate to="/login" />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={currentUser?.role === 'admin' ? <Admin /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
        <Footer />
        {toast && <Toast key={toast.id} {...toast} onClose={() => setToast(null)} />}
      </div>
    </AppCtx.Provider>
  )
}
