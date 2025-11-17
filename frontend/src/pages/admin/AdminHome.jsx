import { useMemo } from 'react'
import dayjs from 'dayjs'
import { PageHeader } from '../../components/PageHeader'
import { StatsCard } from '../../components/StatsCard'
import { TicketStatusBadge } from '../../components/TicketStatusBadge'
import { PriorityTag } from '../../components/PriorityTag'
import { useData } from '../../context/DataContext'

export function AdminHome() {
  const { tickets, notifications } = useData()

  const metrics = useMemo(() => {
    const openStatuses = ['Open', 'In Progress', 'Pending']
    const waiting = tickets.filter((ticket) =>
      openStatuses.includes(ticket.status),
    )
    const highPriority = waiting.filter((ticket) =>
      ['High', 'Critical'].includes(ticket.priority),
    )
    return {
      total: tickets.length,
      waiting: waiting.length,
      highPriority: highPriority.length,
      resolvedThisWeek: tickets.filter((ticket) =>
        dayjs(ticket.updatedAt).isAfter(dayjs().startOf('week')),
      ).length,
    }
  }, [tickets])

  const topUrgent = useMemo(() => {
    return [...tickets]
      .filter((ticket) =>
        ['Open', 'In Progress', 'Pending'].includes(ticket.status),
      )
      .sort((a, b) => dayjs(b.updatedAt).valueOf() - dayjs(a.updatedAt).valueOf())
      .slice(0, 5)
  }, [tickets])

  return (
    <div className="space-y-8">
      <PageHeader
        title="แดชบอร์ดภาพรวม"
        description="ตรวจสอบสถานะงานในคิวและการแจ้งเตือนล่าสุดของทีม IT"
      />
      <div className="grid gap-4 sm:grid-cols-4">
        <StatsCard label="Ticket ทั้งหมด" value={metrics.total} />
        <StatsCard
          label="กำลังดำเนินการ"
          value={metrics.waiting}
          hint="Open + In Progress + Pending"
        />
        <StatsCard
          label="ความสำคัญสูง/เร่งด่วน"
          value={metrics.highPriority}
          hint="High + Critical"
        />
        <StatsCard
          label="Resolved ในสัปดาห์นี้"
          value={metrics.resolvedThisWeek}
        />
      </div>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-lg font-semibold text-white">
            Ticket ที่ต้องเร่งด่วน
          </h2>
          <table className="mt-4 w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="text-slate-400">
              <tr>
                <th className="pb-3 font-medium">Ticket</th>
                <th className="pb-3 font-medium">สถานะ</th>
                <th className="pb-3 font-medium">ความสำคัญ</th>
                <th className="pb-3 font-medium">อัปเดตล่าสุด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 text-slate-200">
              {topUrgent.map((ticket) => (
                <tr key={ticket.id}>
                  <td className="py-3">
                    <p className="font-semibold">{ticket.subject}</p>
                    <p className="text-xs text-slate-400">{ticket.id}</p>
                  </td>
                  <td className="py-3">
                    <TicketStatusBadge status={ticket.status} />
                  </td>
                  <td className="py-3">
                    <PriorityTag priority={ticket.priority} />
                  </td>
                  <td className="py-3 text-xs text-slate-400">
                    {dayjs(ticket.updatedAt).format('DD MMM YYYY HH:mm')}
                  </td>
                </tr>
              ))}
              {topUrgent.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="py-6 text-center text-sm text-slate-400"
                  >
                    ยังไม่มี Ticket ความสำคัญสูงในตอนนี้
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-lg font-semibold text-white">การแจ้งเตือน</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {notifications.slice(0, 6).map((notification) => (
              <li
                key={notification.id}
                className="rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2"
              >
                <p>{notification.message}</p>
                <p className="text-xs text-slate-500">
                  {dayjs(notification.createdAt).format(
                    'DD MMM YYYY HH:mm',
                  )}{' '}
                  • {notification.ticketId ?? '-'}
                </p>
              </li>
            ))}
            {notifications.length === 0 ? (
              <li className="text-sm text-slate-400">
                ยังไม่มีการแจ้งเตือนในระบบ
              </li>
            ) : null}
          </ul>
        </div>
      </section>
    </div>
  )
}
