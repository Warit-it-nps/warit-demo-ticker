import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { PageHeader } from '../../components/PageHeader'
import { TicketStatusBadge } from '../../components/TicketStatusBadge'
import { PriorityTag } from '../../components/PriorityTag'
import { Timeline } from '../../components/Timeline'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import {
  mockUsers,
  ticketPriorities,
  ticketStatuses,
} from '../../data/mockData'

const teamMembers = mockUsers.filter((user) =>
  ['admin', 'manager'].includes(user.role),
)

const statusWorkflow = {
  Open: ['In Progress', 'Pending', 'Canceled'],
  'In Progress': ['Pending', 'Resolved', 'Canceled'],
  Pending: ['In Progress', 'Resolved', 'Canceled'],
  Resolved: ['Closed', 'In Progress'],
  Closed: ['In Progress'],
  Canceled: [],
}

function findUser(id) {
  return mockUsers.find((user) => user.id === id)
}

export function AdminTicketDetail() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const {
    tickets,
    addMessage,
    addInternalNote,
    assignTicket,
    changeStatus,
  } = useData()

  const ticket = useMemo(
    () => tickets.find((item) => item.id === ticketId),
    [tickets, ticketId],
  )
  const [assignTarget, setAssignTarget] = useState(ticket?.assigneeId ?? '')
  const [priority, setPriority] = useState(ticket?.priority ?? 'Normal')
  const [publicReply, setPublicReply] = useState('')
  const [internalNote, setInternalNote] = useState('')

  if (!ticket) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-300">ไม่พบ Ticket นี้</p>
        <Link
          to="/admin/tickets"
          className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
        >
          กลับไปคิว Ticket
        </Link>
      </div>
    )
  }

  const allowedStatuses = statusWorkflow[ticket.status] ?? []

  const handleAssign = (event) => {
    event.preventDefault()
    assignTicket({
      ticketId: ticket.id,
      assigneeId: assignTarget || null,
      changedBy: currentUser.id,
    })
  }

  const handleStatusChange = (newStatus) => {
    changeStatus({
      ticketId: ticket.id,
      status: newStatus,
      changedBy: currentUser.id,
      priority,
    })
  }

  const handleUpdatePriority = () => {
    changeStatus({
      ticketId: ticket.id,
      status: ticket.status,
      changedBy: currentUser.id,
      priority,
    })
  }

  const handleReply = (event) => {
    event.preventDefault()
    if (!publicReply.trim()) return
    addMessage({
      ticketId: ticket.id,
      authorId: currentUser.id,
      authorRole: currentUser.role,
      body: publicReply.trim(),
    })
    setPublicReply('')
  }

  const handleNote = (event) => {
    event.preventDefault()
    if (!internalNote.trim()) return
    addInternalNote({
      ticketId: ticket.id,
      authorId: currentUser.id,
      body: internalNote.trim(),
    })
    setInternalNote('')
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={ticket.subject}
        description={`Ticket ${ticket.id} • ผู้แจ้ง ${findUser(ticket.requesterId)?.name}`}
        actions={
          <button
            onClick={() => navigate('/admin/tickets')}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            กลับไปคิว
          </button>
        }
      />
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <TicketStatusBadge status={ticket.status} />
            <PriorityTag priority={ticket.priority} />
            <span className="text-xs text-slate-400">
              อัปเดตเมื่อ {dayjs(ticket.updatedAt).format('DD MMM YYYY HH:mm')}
            </span>
          </div>
          <div className="space-y-2 text-sm text-slate-200">
            <h2 className="font-semibold text-white">รายละเอียดสำหรับทีม IT</h2>
            <p className="whitespace-pre-wrap text-slate-300">
              {ticket.description}
            </p>
            <p className="text-xs text-slate-400">
              หมวดหมู่: {ticket.category} • ผู้แจ้ง{' '}
              {findUser(ticket.requesterId)?.department}
            </p>
          </div>
          <section className="space-y-5">
            <header className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-white">
                การสื่อสารกับผู้ใช้
              </h3>
              <button
                onClick={() => handleStatusChange('Resolved')}
                className="rounded-lg border border-emerald-500/70 px-3 py-1.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-500/10"
              >
                มาร์กว่าดำเนินการเสร็จ (Resolved)
              </button>
            </header>
            <div className="space-y-4">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <p className="font-semibold text-slate-200">
                      {findUser(message.authorId)?.name ?? message.authorId} (
                      {message.authorRole})
                    </p>
                    <span>
                      {dayjs(message.createdAt).format('DD MMM YYYY HH:mm')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">{message.body}</p>
                </div>
              ))}
              {ticket.messages.length === 0 ? (
                <p className="text-sm text-slate-400">ยังไม่มีการสนทนา</p>
              ) : null}
            </div>
            <form onSubmit={handleReply} className="space-y-3">
              <textarea
                rows={4}
                value={publicReply}
                onChange={(event) => setPublicReply(event.target.value)}
                placeholder="ตอบกลับผู้ใช้งาน"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
                >
                  ส่งข้อความ
                </button>
              </div>
            </form>
          </section>
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-white">
              Internal Notes (เฉพาะทีม IT)
            </h3>
            <div className="space-y-3">
              {ticket.internalNotes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-sm text-slate-200"
                >
                  <div className="text-xs text-slate-400">
                    {findUser(note.authorId)?.name} •{' '}
                    {dayjs(note.createdAt).format('DD MMM YYYY HH:mm')}
                  </div>
                  <p className="mt-2 text-slate-200">{note.body}</p>
                </div>
              ))}
              {ticket.internalNotes.length === 0 ? (
                <p className="text-sm text-slate-400">
                  ยังไม่มีบันทึกภายใน ลองเพิ่มบันทึกเพื่อเก็บความรู้
                </p>
              ) : null}
            </div>
            <form onSubmit={handleNote} className="space-y-3">
              <textarea
                rows={3}
                value={internalNote}
                onChange={(event) => setInternalNote(event.target.value)}
                placeholder="บันทึกข้อความภายใน (ผู้ใช้จะไม่เห็น)"
                className="w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-200"
                >
                  เพิ่ม Internal Note
                </button>
              </div>
            </form>
          </section>
        </article>
        <aside className="space-y-6">
          <form
            onSubmit={handleAssign}
            className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-200"
          >
            <div>
              <h3 className="text-sm font-semibold text-white">
                มอบหมาย Ticket
              </h3>
              <p className="text-xs text-slate-400">
                เลือกผู้รับผิดชอบจากทีม IT
              </p>
            </div>
            <select
              value={assignTarget}
              onChange={(event) => setAssignTarget(event.target.value)}
              className="w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
            >
              <option value="">ยังไม่มอบหมาย</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>
            <button
              type="submit"
              className="w-full rounded-lg bg-emerald-500 px-3 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              บันทึกการมอบหมาย
            </button>
          </form>
          <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 text-sm text-slate-200">
            <div>
              <h3 className="text-sm font-semibold text-white">
                ปรับสถานะตาม Workflow
              </h3>
              <p className="text-xs text-slate-400">
                เลือกสถานะถัดไปที่อนุญาตใน state machine
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {allowedStatuses.length ? (
                allowedStatuses.map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(status)}
                    className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-200"
                    type="button"
                  >
                    {status}
                  </button>
                ))
              ) : (
                <p className="text-xs text-slate-500">ไม่มีสถานะถัดไป</p>
              )}
            </div>
            <div>
              <label className="text-xs font-semibold text-white">
                ความสำคัญ
                <select
                  value={priority}
                  onChange={(event) => setPriority(event.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
                >
                  {ticketPriorities.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>
              </label>
              <button
                onClick={handleUpdatePriority}
                className="mt-2 w-full rounded-lg border border-amber-500/50 px-3 py-1.5 text-xs font-semibold text-amber-200 transition hover:bg-amber-500/10"
              >
                บันทึกความสำคัญ
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
            <h3 className="text-sm font-semibold text-white">
              Timeline สถานะ
            </h3>
            <div className="mt-4">
              <Timeline items={ticket.statusHistory} />
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}
