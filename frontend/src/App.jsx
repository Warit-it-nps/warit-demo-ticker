import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import { LoginPage } from './pages/shared/Login.jsx'
import { DashboardLayout } from './pages/shared/DashboardLayout.jsx'
import { PrimaryNav } from './components/PrimaryNav.jsx'
import { UserHome } from './pages/user/UserHome.jsx'
import { UserCreateTicket } from './pages/user/UserCreateTicket.jsx'
import { UserTicketList } from './pages/user/UserTicketList.jsx'
import { UserTicketDetail } from './pages/user/UserTicketDetail.jsx'
import { KnowledgeBasePage } from './pages/user/KnowledgeBase.jsx'
import { AdminHome } from './pages/admin/AdminHome.jsx'
import { AdminTicketList } from './pages/admin/AdminTicketList.jsx'
import { AdminTicketDetail } from './pages/admin/AdminTicketDetail.jsx'
import { AdminKnowledgeBase } from './pages/admin/AdminKnowledgeBase.jsx'
import { AdminReporting } from './pages/admin/AdminReporting.jsx'

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, currentUser } = useAuth()
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  if (roles && !roles.includes(currentUser.role)) {
    const fallback = currentUser.role === 'user' ? '/user' : '/admin'
    return <Navigate to={fallback} replace />
  }
  return children
}

function RedirectHome() {
  const { isAuthenticated, currentUser } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  return currentUser.role === 'user' ? (
    <Navigate to="/user" replace />
  ) : (
    <Navigate to="/admin" replace />
  )
}

const userNavItems = [
  { label: 'ภาพรวม', to: '/user' },
  { label: 'แจ้งปัญหาใหม่', to: '/user/create' },
  { label: 'Ticket ของฉัน', to: '/user/tickets' },
  { label: 'Knowledge Base', to: '/user/knowledge-base' },
]

const adminNavItems = [
  { label: 'แดชบอร์ด', to: '/admin' },
  { label: 'คิว Ticket', to: '/admin/tickets' },
  { label: 'Knowledge Base', to: '/admin/knowledge-base' },
  { label: 'รายงาน', to: '/admin/reports' },
]

function App() {
  return (
    <Routes>
      <Route path="/" element={<RedirectHome />} />
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/user"
        element={
          <ProtectedRoute roles={['user']}>
            <DashboardLayout nav={<PrimaryNav items={userNavItems} />} />
          </ProtectedRoute>
        }
      >
        <Route index element={<UserHome />} />
        <Route path="create" element={<UserCreateTicket />} />
        <Route path="tickets" element={<Outlet />}>
          <Route index element={<UserTicketList />} />
          <Route path=":ticketId" element={<UserTicketDetail />} />
        </Route>
        <Route path="knowledge-base" element={<KnowledgeBasePage />} />
      </Route>

      <Route
        path="/admin"
        element={
          <ProtectedRoute roles={['admin', 'manager']}>
            <DashboardLayout nav={<PrimaryNav items={adminNavItems} />} />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminHome />} />
        <Route path="tickets" element={<Outlet />}>
          <Route index element={<AdminTicketList />} />
          <Route path=":ticketId" element={<AdminTicketDetail />} />
        </Route>
        <Route path="knowledge-base" element={<AdminKnowledgeBase />} />
        <Route path="reports" element={<AdminReporting />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
