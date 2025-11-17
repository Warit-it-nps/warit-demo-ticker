import dayjs from 'dayjs'
import { PageHeader } from '../../components/PageHeader'
import { StatsCard } from '../../components/StatsCard'
import { TicketStatusBadge } from '../../components/TicketStatusBadge'
import { PriorityTag } from '../../components/PriorityTag'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

export function UserHome() {
  const { currentUser } = useAuth()
  const { tickets } = useData()
  const myTickets = tickets.filter(
    (ticket) => ticket.requesterId === currentUser.id,
  )

  return (
    <div className="space-y-8">
      <PageHeader
        title="ภาพรวมการแจ้งปัญหา"
        description="ติดตามสถานะล่าสุดและสร้าง Ticket ใหม่เมื่อต้องการความช่วยเหลือ"
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Ticket ทั้งหมดของฉัน"
          value={myTickets.length}
          hint="นับรวม Ticket ที่เปิดอยู่และปิดแล้ว"
        />
        <StatsCard
          label="กำลังดำเนินการ"
          value={myTickets.filter((ticket) =>
            ['Open', 'In Progress', 'Pending', 'Resolved'].includes(
              ticket.status,
            ),
          ).length}
          hint="รวมสถานะ Open, In Progress, Pending, Resolved"
        />
        <StatsCard
          label="ปิดงานแล้ว"
          value={myTickets.filter((ticket) => ticket.status === 'Closed').length}
        />
      </div>
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-white">
          งานล่าสุดของฉัน
        </h2>
        <div className="overflow-hidden rounded-xl border border-slate-800">
          <table className="min-w-full divide-y divide-slate-800 text-left text-sm">
            <thead className="bg-slate-900/80 text-slate-300">
              <tr>
                <th className="px-4 py-3 font-medium">Ticket</th>
                <th className="px-4 py-3 font-medium">สถานะ</th>
                <th className="px-4 py-3 font-medium">ความสำคัญ</th>
                <th className="px-4 py-3 font-medium">อัปเดตล่าสุด</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900 bg-slate-950/60">
              {myTickets.slice(0, 5).map((ticket) => (
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
                </tr>
              ))}
              {myTickets.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-6 text-center text-sm text-slate-400"
                  >
                    ยังไม่มี Ticket ในระบบ ลองสร้าง Ticket ใหม่ได้เลย
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
