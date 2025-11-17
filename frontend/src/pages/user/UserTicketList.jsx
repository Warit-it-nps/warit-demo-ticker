import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { TicketStatusBadge } from '../../components/TicketStatusBadge'
import { PriorityTag } from '../../components/PriorityTag'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { ticketStatuses } from '../../data/mockData'

export function UserTicketList() {
  const { currentUser } = useAuth()
  const { tickets } = useData()
  const [statusFilter, setStatusFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return tickets
      .filter((ticket) => ticket.requesterId === currentUser.id)
      .filter((ticket) =>
        statusFilter === 'all' ? true : ticket.status === statusFilter,
      )
      .filter((ticket) =>
        search
          ? ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
            ticket.id.toLowerCase().includes(search.toLowerCase())
          : true,
      )
  }, [tickets, currentUser.id, statusFilter, search])

  return (
    <div className="space-y-8">
      <PageHeader
        title="Ticket ของฉัน"
        description="ติดตามสถานะปัจจุบันและดูรายละเอียดเพื่อโต้ตอบกับทีม IT"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
        >
          <option value="all">สถานะทั้งหมด</option>
          {ticketStatuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาจากหัวข้อหรือหมายเลข Ticket"
          className="w-64 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
        />
      </div>
      <div className="overflow-hidden rounded-xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">ความสำคัญ</th>
              <th className="px-4 py-3 font-medium">อัปเดตล่าสุด</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 bg-slate-950/60">
            {filtered.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-900/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-white">{ticket.subject}</p>
                  <p className="text-xs text-slate-400">{ticket.id}</p>
                </td>
                <td className="px-4 py-3">
                  <TicketStatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityTag priority={ticket.priority} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-400">
                  {dayjs(ticket.updatedAt).format('DD MMM YYYY HH:mm')}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/user/tickets/${ticket.id}`}
                    className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    ดูรายละเอียด
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-4 py-6 text-center text-sm text-slate-400"
                >
                  ไม่พบ Ticket ที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
