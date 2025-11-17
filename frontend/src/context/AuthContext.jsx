import { createContext, useContext, useMemo, useState } from 'react'
import { mockUsers } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const raw = window.localStorage.getItem('sessionUser')
    return raw ? JSON.parse(raw) : null
  })

  const login = (email) => {
    const found = mockUsers.find(
      (user) => user.email.toLowerCase() === email.toLowerCase(),
    )
    if (!found) {
      throw new Error('ไม่พบผู้ใช้งานในระบบ AD จำลอง')
    }
    setCurrentUser(found)
    window.localStorage.setItem('sessionUser', JSON.stringify(found))
    return found
  }

  const logout = () => {
    setCurrentUser(null)
    window.localStorage.removeItem('sessionUser')
  }

  const value = useMemo(
    () => ({
      currentUser,
      isAuthenticated: Boolean(currentUser),
      login,
      logout,
    }),
    [currentUser],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth ต้องใช้ภายใต้ AuthProvider')
  }
  return ctx
}
