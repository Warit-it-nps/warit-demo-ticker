import { useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { PageHeader } from '../../components/PageHeader'
import { TicketStatusBadge } from '../../components/TicketStatusBadge'
import { PriorityTag } from '../../components/PriorityTag'
import { Timeline } from '../../components/Timeline'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { mockUsers } from '../../data/mockData'

function getUserName(id) {
  return mockUsers.find((user) => user.id === id)?.name ?? id
}

export function UserTicketDetail() {
  const { ticketId } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { tickets, addMessage, changeStatus } = useData()
  const ticket = useMemo(
    () => tickets.find((item) => item.id === ticketId),
    [tickets, ticketId],
  )
  const [reply, setReply] = useState('')
  const [feedback, setFeedback] = useState('')

  if (!ticket) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-slate-300">ไม่พบ Ticket นี้</p>
        <Link
          to="/user/tickets"
          className="text-sm font-semibold text-emerald-400 hover:text-emerald-300"
        >
          กลับไปหน้ารายการ
        </Link>
      </div>
    )
  }

  const handleReply = (event) => {
    event.preventDefault()
    if (!reply.trim()) return
    addMessage({
      ticketId: ticket.id,
      authorId: currentUser.id,
      authorRole: 'user',
      body: reply.trim(),
    })
    setFeedback('ส่งข้อความถึงทีม IT แล้ว ระบบได้แจ้งเตือนให้เรียบร้อย')
    setReply('')
  }

  const handleClose = () => {
    changeStatus({
      ticketId: ticket.id,
      status: 'Closed',
      changedBy: currentUser.id,
    })
    setFeedback('ขอบคุณที่ยืนยันการปิดงาน Ticket นี้ถูกปิดแล้ว')
  }

  const handleReopen = () => {
    changeStatus({
      ticketId: ticket.id,
      status: 'In Progress',
      changedBy: currentUser.id,
    })
    setFeedback('เปิด Ticket อีกครั้งแล้ว ทีม IT จะกลับมาติดตามให้โดยเร็ว')
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title={ticket.subject}
        description={`หมายเลข ${ticket.id} • สร้างเมื่อ ${dayjs(
          ticket.createdAt,
        ).format('DD MMM YYYY HH:mm')}`}
        actions={
          <button
            onClick={() => navigate('/user/tickets')}
            className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
          >
            กลับไปหน้ารายการ
          </button>
        }
      />
      {feedback ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          {feedback}
        </div>
      ) : null}
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
            <h2 className="font-semibold text-white">รายละเอียด</h2>
            <p className="whitespace-pre-wrap text-slate-300">
              {ticket.description}
            </p>
            <p className="text-xs text-slate-400">
              ประเภทปัญหา: {ticket.category}
            </p>
          </div>
          <section className="space-y-4">
            <h3 className="text-sm font-semibold text-white">
              ประวัติการสื่อสาร
            </h3>
            <div className="space-y-4">
              {ticket.messages.map((message) => (
                <div
                  key={message.id}
                  className="rounded-xl border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <p className="font-semibold text-slate-200">
                      {getUserName(message.authorId)} ({message.authorRole})
                    </p>
                    <span>
                      {dayjs(message.createdAt).format('DD MMM YYYY HH:mm')}
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-slate-200">{message.body}</p>
                </div>
              ))}
              {ticket.messages.length === 0 ? (
                <p className="text-sm text-slate-400">
                  ยังไม่มีการตอบกลับ ลองส่งข้อมูลเพิ่มเติมเพื่อให้ทีม IT ช่วยได้เร็วขึ้น
                </p>
              ) : null}
            </div>
          </section>
          <form onSubmit={handleReply} className="space-y-3">
            <label className="text-sm font-semibold text-white">
              ตอบกลับทีม IT
              <textarea
                value={reply}
                onChange={(event) => setReply(event.target.value)}
                rows={4}
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
                placeholder="ให้ข้อมูลเพิ่มเติมหรือสอบถามความคืบหน้า"
              />
            </label>
            <div className="flex flex-wrap gap-2">
              <button
                type="submit"
                className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
              >
                ส่งข้อความ
              </button>
              {ticket.status === 'Resolved' ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-lg border border-emerald-500/60 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
                >
                  ปิดงาน (Close)
                </button>
              ) : null}
              {['Closed', 'Resolved'].includes(ticket.status) === false ? (
                <button
                  type="button"
                  onClick={handleReopen}
                  className="rounded-lg border border-amber-500/60 px-4 py-2 text-sm font-semibold text-amber-300 transition hover:bg-amber-500/10"
                >
                  ขอความคืบหน้า
                </button>
              ) : null}
              {ticket.status === 'Closed' ? (
                <button
                  type="button"
                  onClick={handleReopen}
                  className="rounded-lg border border-emerald-500/60 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/10"
                >
                  เปิดงานใหม่ (Re-open)
                </button>
              ) : null}
            </div>
          </form>
        </article>
        <aside className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5 text-sm text-slate-300">
            <h3 className="text-sm font-semibold text-white">
              ข้อมูล Ticket
            </h3>
            <dl className="mt-4 space-y-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  ผู้แจ้ง
                </dt>
                <dd>{getUserName(ticket.requesterId)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  ผู้รับผิดชอบ
                </dt>
                <dd>
                  {ticket.assigneeId ? getUserName(ticket.assigneeId) : '-'}
                </dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  ปิดอัตโนมัติ
                </dt>
                <dd>
                  {dayjs(ticket.closeDueAt).format('DD MMM YYYY HH:mm')} (หากสถานะ
                  Resolved)
                </dd>
              </div>
            </dl>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
            <h3 className="text-sm font-semibold text-white">
              เส้นทางสถานะ (Workflow)
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
