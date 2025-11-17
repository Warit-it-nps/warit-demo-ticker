import { useMemo, useState } from 'react'
import dayjs from 'dayjs'
import { PageHeader } from '../../components/PageHeader'
import { useAuth } from '../../context/AuthContext'
import { useData } from '../../context/DataContext'

const defaultForm = {
  id: null,
  title: '',
  category: 'General',
  content: '',
  keywords: '',
  status: 'Draft',
}

export function AdminKnowledgeBase() {
  const { currentUser } = useAuth()
  const { knowledgeBase, upsertKnowledgeBase, deleteKnowledgeBase } = useData()
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState(defaultForm)
  const [showForm, setShowForm] = useState(false)

  const stats = useMemo(() => {
    const published = knowledgeBase.filter(
      (article) => article.status === 'Published',
    )
    return {
      total: knowledgeBase.length,
      draft: knowledgeBase.filter((article) => article.status === 'Draft').length,
      published: published.length,
      mostHelpful: published
        .slice()
        .sort((a, b) => b.helpfulCount - a.helpfulCount)[0],
    }
  }, [knowledgeBase])

  const filtered = useMemo(() => {
    return knowledgeBase.filter((article) =>
      filter === 'all' ? true : article.status === filter,
    )
  }, [knowledgeBase, filter])

  const handleSubmit = (event) => {
    event.preventDefault()
    const article = upsertKnowledgeBase({
      ...form,
      keywords: form.keywords
        .split(',')
        .map((word) => word.trim())
        .filter(Boolean),
      authorId: currentUser.id,
    })
    setForm(defaultForm)
    setShowForm(false)
    return article
  }

  const handleEdit = (article) => {
    setForm({
      id: article.id,
      title: article.title,
      category: article.category,
      content: article.content,
      status: article.status,
      keywords: article.keywords.join(', '),
    })
    setShowForm(true)
  }

  const handleDelete = (id) => {
    // eslint-disable-next-line no-alert
    const confirmDelete = window.confirm('ยืนยันลบบทความนี้หรือไม่?')
    if (confirmDelete) {
      deleteKnowledgeBase(id)
    }
  }

  return (
    <div className="space-y-8">
      <PageHeader
        title="จัดการ Knowledge Base"
        description="สร้างและอัปเดตบทความเพื่อให้ข้อมูลผู้ใช้งานทันสมัย"
        actions={
          <button
            onClick={() => {
              setForm(defaultForm)
              setShowForm(true)
            }}
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
          >
            + สร้างบทความ
          </button>
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-sm text-slate-400">บทความทั้งหมด</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {stats.total}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-sm text-slate-400">ฉบับร่าง</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {stats.draft}
          </p>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-4">
          <p className="text-sm text-slate-400">เผยแพร่แล้ว</p>
          <p className="mt-1 text-2xl font-semibold text-white">
            {stats.published}
          </p>
          {stats.mostHelpful ? (
            <p className="mt-2 text-xs text-slate-500">
              ยอดนิยม: {stats.mostHelpful.title} ({stats.mostHelpful.helpfulCount}{' '}
              hits)
            </p>
          ) : null}
        </div>
      </div>
      {showForm ? (
        <form
          onSubmit={handleSubmit}
          className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              {form.id ? 'แก้ไขบทความ' : 'สร้างบทความใหม่'}
            </h2>
            <button
              type="button"
              onClick={() => {
                setShowForm(false)
                setForm(defaultForm)
              }}
              className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              ปิดฟอร์ม
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-white">
              ชื่อบทความ
              <input
                required
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
              />
            </label>
            <label className="text-sm font-medium text-white">
              หมวดหมู่
              <input
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, category: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
              />
            </label>
          </div>
          <label className="text-sm font-medium text-white">
            รายละเอียดบทความ
            <textarea
              required
              rows={6}
              value={form.content}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, content: event.target.value }))
              }
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
            />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium text-white">
              Keywords (คั่นด้วยเครื่องหมายจุลภาค)
              <input
                value={form.keywords}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, keywords: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
              />
            </label>
            <label className="text-sm font-medium text-white">
              สถานะบทความ
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value }))
                }
                className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </label>
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => {
                setForm(defaultForm)
                setShowForm(false)
              }}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-800"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
            >
              บันทึกบทความ
            </button>
          </div>
        </form>
      ) : null}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/80">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-300">กรองสถานะ</span>
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value)}
              className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
            >
              <option value="all">ทั้งหมด</option>
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>
          <p className="text-xs text-slate-400">
            คลิกแก้ไขเพื่ออัปเดต หรือกดลบเพื่อนำบทความออกจากฐานความรู้
          </p>
        </div>
        <table className="min-w-full divide-y divide-slate-800 text-left text-sm text-slate-200">
          <thead className="bg-slate-900/70">
            <tr>
              <th className="px-6 py-3 font-medium">บทความ</th>
              <th className="px-6 py-3 font-medium">สถานะ</th>
              <th className="px-6 py-3 font-medium">ปรับปรุงล่าสุด</th>
              <th className="px-6 py-3 font-medium">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900">
            {filtered.map((article) => (
              <tr key={article.id} className="hover:bg-slate-900/40">
                <td className="px-6 py-3">
                  <p className="font-semibold text-white">{article.title}</p>
                  <p className="text-xs text-slate-400">{article.category}</p>
                </td>
                <td className="px-6 py-3 text-sm text-slate-300">
                  {article.status}
                </td>
                <td className="px-6 py-3 text-xs text-slate-400">
                  {dayjs(article.updatedAt).format('DD MMM YYYY HH:mm')}
                </td>
                <td className="px-6 py-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(article)}
                      className="rounded-lg border border-slate-700 px-3 py-1 text-xs font-semibold text-slate-200 transition hover:border-emerald-500 hover:text-emerald-200"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="rounded-lg border border-rose-500/60 px-3 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10"
                    >
                      ลบ
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="px-6 py-6 text-center text-sm text-slate-400"
                >
                  ไม่มีบทความในสถานะนี้
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
