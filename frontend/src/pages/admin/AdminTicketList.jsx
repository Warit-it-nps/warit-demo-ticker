import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/PageHeader'
import { TicketStatusBadge } from '../../components/TicketStatusBadge'
import { PriorityTag } from '../../components/PriorityTag'
import { useData } from '../../context/DataContext'
import {
  mockUsers,
  ticketPriorities,
  ticketStatuses,
} from '../../data/mockData'

const teamMembers = mockUsers.filter((user) =>
  ['admin', 'manager'].includes(user.role),
)

export function AdminTicketList() {
  const { tickets } = useData()
  const [status, setStatus] = useState('all')
  const [priority, setPriority] = useState('all')
  const [assignee, setAssignee] = useState('all')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    return tickets
      .filter((ticket) =>
        status === 'all' ? true : ticket.status === status,
      )
      .filter((ticket) =>
        priority === 'all' ? true : ticket.priority === priority,
      )
      .filter((ticket) =>
        assignee === 'all'
          ? true
          : assignee === 'unassigned'
            ? !ticket.assigneeId
            : ticket.assigneeId === assignee,
      )
      .filter((ticket) =>
        search
          ? ticket.subject.toLowerCase().includes(search.toLowerCase()) ||
            ticket.id.toLowerCase().includes(search.toLowerCase())
          : true,
      )
  }, [tickets, status, priority, assignee, search])

  return (
    <div className="space-y-8">
      <PageHeader
        title="คิว Ticket"
        description="ใช้ฟิลเตอร์เพื่อจัดลำดับความสำคัญและเข้าถึง Ticket ที่ต้องการ"
      />
      <div className="flex flex-wrap items-center gap-3">
        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
        >
          <option value="all">ทุกสถานะ</option>
          {ticketStatuses.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
        >
          <option value="all">ทุกความสำคัญ</option>
          {ticketPriorities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
        <select
          value={assignee}
          onChange={(event) => setAssignee(event.target.value)}
          className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
        >
          <option value="all">ผู้รับผิดชอบทั้งหมด</option>
          <option value="unassigned">ยังไม่มีผู้รับ</option>
          {teamMembers.map((member) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </select>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="ค้นหาจากหัวข้อหรือ Ticket ID"
          className="w-64 rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
        />
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
          <thead className="bg-slate-900/80 text-slate-300">
            <tr>
              <th className="px-4 py-3 font-medium">Ticket</th>
              <th className="px-4 py-3 font-medium">สถานะ</th>
              <th className="px-4 py-3 font-medium">ความสำคัญ</th>
              <th className="px-4 py-3 font-medium">ผู้รับผิดชอบ</th>
              <th className="px-4 py-3 font-medium">อัปเดตล่าสุด</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900 bg-slate-950/60 text-slate-200">
            {filtered.map((ticket) => (
              <tr key={ticket.id} className="hover:bg-slate-900/60">
                <td className="px-4 py-3">
                  <p className="font-semibold text-white">{ticket.subject}</p>
                  <p className="text-xs text-slate-400">
                    {ticket.id} • {ticket.category}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <TicketStatusBadge status={ticket.status} />
                </td>
                <td className="px-4 py-3">
                  <PriorityTag priority={ticket.priority} />
                </td>
                <td className="px-4 py-3 text-sm text-slate-300">
                  {ticket.assigneeId
                    ? teamMembers.find(
                        (member) => member.id === ticket.assigneeId,
                      )?.name ?? ticket.assigneeId
                    : '-'}
                </td>
                <td className="px-4 py-3 text-xs text-slate-400">
                  {dayjs(ticket.updatedAt).format('DD MMM YYYY HH:mm')}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/admin/tickets/${ticket.id}`}
                    className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
                  >
                    จัดการ
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="px-4 py-6 text-center text-sm text-slate-400"
                >
                  ไม่พบ Ticket ที่ตรงกับการกรอง
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
