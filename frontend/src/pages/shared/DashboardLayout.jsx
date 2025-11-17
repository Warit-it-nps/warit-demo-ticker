import { Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export function DashboardLayout({ nav }) {
  const { currentUser, logout } = useAuth()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      <header className="border-b border-slate-800 bg-slate-900/80">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">
              Internal IT Helpdesk
            </h1>
            <p className="text-sm text-slate-400">
              ยินดีต้อนรับ {currentUser?.name} ({currentUser?.role})
            </p>
          </div>
          <button
            onClick={logout}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            ออกจากระบบ
          </button>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-4">{nav}</div>
      </header>
      <main className="mx-auto max-w-6xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  )
}
