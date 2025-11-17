import { PageHeader } from '../../components/PageHeader'
import { StatsCard } from '../../components/StatsCard'
import { useData } from '../../context/DataContext'

export function AdminReporting() {
  const { metrics } = useData()

  return (
    <div className="space-y-8">
      <PageHeader
        title="รายงานและตัวชี้วัด"
        description="ติดตาม Adoption Rate, CSAT และสถิติ Ticket เพื่อประกอบการตัดสินใจของผู้บริหาร"
        actions={
          <button
            onClick={() =>
              window.alert('Export เป็น CSV (ตัวอย่างในเวอร์ชัน dummy)')
            }
            className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-200"
          >
            ส่งออก CSV
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatsCard
          label="Ticket Adoption Rate"
          value={`${(metrics.adoptionRate * 100).toFixed(0)}%`}
          hint="เป้าหมาย > 90%"
        />
        <StatsCard
          label="Average Resolution Time"
          value={`${metrics.averageResolutionHours} ชม.`}
          hint="ลดลง 30% ภายใน 6 เดือน"
        />
        <StatsCard
          label="คะแนนความพึงพอใจ (CSAT)"
          value={metrics.csatScore.toFixed(1)}
          hint="เป้าหมาย 4.5/5"
        />
      </div>
      <section className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-lg font-semibold text-white">
            ปริมาณ Ticket รายเดือน
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {metrics.ticketVolume.map((item) => (
              <li
                key={item.month}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2"
              >
                <span className="font-semibold text-white">{item.month}</span>
                <span>
                  สร้าง {item.total} • ปิดแล้ว {item.resolved}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          <h2 className="text-lg font-semibold text-white">
            ปัญหาที่พบบ่อยที่สุด
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-slate-300">
            {metrics.popularCategories.map((item) => (
              <li
                key={item.category}
                className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-900/50 px-3 py-2"
              >
                <span className="font-semibold text-white">
                  {item.category}
                </span>
                <span>{item.count} Ticket</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6 text-sm text-slate-300">
        <h2 className="text-lg font-semibold text-white">โน้ตสำหรับผู้บริหาร</h2>
        <ul className="mt-4 list-disc space-y-2 pl-5">
          <li>
            อัตราการใช้งานระบบ 92% สูงกว่าเป้าหมาย แนะนำให้สื่อสารต่อเนื่องเพื่อให้
            Ticket นอกระบบลดลงต่อไป
          </li>
          <li>
            ค่าเฉลี่ยเวลาปิดงาน 14 ชั่วโมง ต่ำกว่าเป้าหมาย 30% แล้ว ให้รักษามาตรฐาน
            โดยเน้น Ticket ความสำคัญสูงก่อน
          </li>
          <li>
            แผนการอัปเดต Knowledge Base ช่วยลด Ticket หมวด Software
            ที่ยังมีจำนวนมาก
          </li>
        </ul>
      </section>
    </div>
  )
}
