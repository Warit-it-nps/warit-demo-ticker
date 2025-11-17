import { useState } from 'react'
import dayjs from 'dayjs'
import { PageHeader } from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'
import { ticketPriorities } from '../../data/mockData'

const categories = ['Hardware', 'Software', 'Network', 'Access', 'Other']

export function UserCreateTicket() {
  const { currentUser } = useAuth()
  const { createTicket } = useData()
  const [form, setForm] = useState({
    subject: '',
    description: '',
    category: categories[0],
    priority: 'Normal',
  })
  const [attachments, setAttachments] = useState([])
  const [confirmation, setConfirmation] = useState(null)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleFiles = (event) => {
    const files = Array.from(event.target.files ?? []).map((file) => ({
      name: file.name,
      size: file.size,
    }))
    setAttachments(files)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const ticket = createTicket({
      subject: form.subject,
      description: form.description,
      category: form.category,
      priority: form.priority,
      attachments,
      requesterId: currentUser.id,
    })
    setConfirmation({
      ticketId: ticket.id,
      createdAt: dayjs(ticket.createdAt).format('DD MMM YYYY HH:mm'),
    })
    setForm({
      subject: '',
      description: '',
      category: categories[0],
      priority: 'Normal',
    })
    setAttachments([])
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="แจ้งปัญหาใหม่"
        description="กรอกข้อมูลให้ครบถ้วนเพื่อให้ทีม IT ช่วยได้รวดเร็ว"
      />
      {confirmation ? (
        <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-sm text-emerald-200">
          <p className="font-semibold">
            รับเรื่องแล้ว! หมายเลข Ticket {confirmation.ticketId}
          </p>
          <p>
            สร้างเมื่อ {confirmation.createdAt} ระบบได้ส่งอีเมลแจ้งยืนยันให้คุณแล้ว
          </p>
        </div>
      ) : null}
      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border border-slate-800 bg-slate-950/80 p-6"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm font-medium text-slate-200">
            ประเภทปัญหา*
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
            >
              {categories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-200">
            ความสำคัญ
            <select
              name="priority"
              value={form.priority}
              onChange={handleChange}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-amber-500/40 focus:border-amber-400 focus:ring"
            >
              {ticketPriorities.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="block text-sm font-medium text-slate-200">
          หัวข้อ*
          <input
            required
            name="subject"
            value={form.subject}
            onChange={handleChange}
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
            placeholder="อธิบายปัญหาโดยย่อ"
          />
        </label>
        <label className="block text-sm font-medium text-slate-200">
          รายละเอียด*
          <textarea
            required
            name="description"
            value={form.description}
            onChange={handleChange}
            rows={6}
            className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
            placeholder="ให้ข้อมูลครบถ้วน เช่น เกิดขึ้นตอนไหน เจอข้อความอะไร"
          />
        </label>
        <label className="block text-sm font-medium text-slate-200">
          แนบไฟล์ (สูงสุด 10MB ต่อไฟล์)
          <input
            type="file"
            multiple
            onChange={handleFiles}
            className="mt-1 block w-full text-sm text-slate-300 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-emerald-950 hover:file:bg-emerald-400"
          />
        </label>
        {attachments.length ? (
          <ul className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-300">
            {attachments.map((file) => (
              <li key={file.name}>
                {file.name} ({(file.size / 1024).toFixed(0)} KB)
              </li>
            ))}
          </ul>
        ) : null}
        <div className="flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-5 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            ส่ง Ticket
          </button>
        </div>
      </form>
    </div>
  )
}
