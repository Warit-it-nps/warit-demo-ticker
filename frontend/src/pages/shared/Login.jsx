import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { mockUsers } from '../../data/mockData'

export function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    try {
      const user = login(email)
      if (user.role === 'user') {
        navigate('/user')
      } else {
        navigate('/admin')
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border border-slate-800 bg-slate-900/90 p-8 shadow-xl">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">
            Internal IT Helpdesk
          </h1>
          <p className="text-sm text-slate-400">
            จำลองการเข้าสู่ระบบผ่าน Active Directory (SSO)
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-left text-sm font-medium text-slate-200">
            อีเมลบริษัท
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
              placeholder="name@example.com"
            />
          </label>
          {error ? (
            <p className="rounded-lg bg-rose-500/20 px-3 py-2 text-sm text-rose-200">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            เข้าสู่ระบบ
          </button>
        </form>
        <div className="rounded-lg border border-slate-800 bg-slate-950 p-4 text-sm text-slate-300">
          <p className="font-semibold text-slate-100">บัญชีทดสอบ</p>
          <ul className="mt-2 space-y-1">
            {mockUsers.map((user) => (
              <li key={user.email}>
                <span className="font-medium">{user.email}</span> — {user.role}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
