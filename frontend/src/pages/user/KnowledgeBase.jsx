import { useMemo, useState } from 'react'
import { PageHeader } from '../../components/PageHeader'
import { useData } from '../../context/DataContext'

export function KnowledgeBasePage() {
  const { knowledgeBase } = useData()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [selected, setSelected] = useState(null)

  const categories = useMemo(() => {
    const distinct = new Set(knowledgeBase.map((item) => item.category))
    return ['all', ...distinct]
  }, [knowledgeBase])

  const filtered = useMemo(() => {
    return knowledgeBase.filter((article) => {
      if (article.status !== 'Published') return false
      const matchesCategory =
        category === 'all' ? true : article.category === category
      const matchesQuery = query
        ? article.title.toLowerCase().includes(query.toLowerCase()) ||
          article.keywords.some((keyword) =>
            keyword.toLowerCase().includes(query.toLowerCase()),
          )
        : true
      return matchesCategory && matchesQuery
    })
  }, [knowledgeBase, query, category])

  const activeArticle = selected
    ? filtered.find((article) => article.id === selected) ?? filtered[0]
    : filtered[0]

  return (
    <div className="space-y-8">
      <PageHeader
        title="Knowledge Base"
        description="ค้นหาวิธีการแก้ไขปัญหาด้วยตนเองก่อนสร้าง Ticket ใหม่"
      />
      <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
        <aside className="space-y-4 rounded-2xl border border-slate-800 bg-slate-950/80 p-5">
          <label className="block text-sm font-medium text-white">
            ค้นหาบทความ
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="เช่น Wi-Fi, Printer"
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
            />
          </label>
          <label className="block text-sm font-medium text-white">
            หมวดหมู่
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-white outline-none ring-emerald-500/40 focus:border-emerald-500 focus:ring"
            >
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item === 'all' ? 'ทั้งหมด' : item}
                </option>
              ))}
            </select>
          </label>
          <div className="space-y-3">
            {filtered.map((article) => (
              <button
                key={article.id}
                onClick={() => setSelected(article.id)}
                className={`block w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
                  activeArticle?.id === article.id
                    ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-200'
                    : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-900/80'
                }`}
              >
                <p className="font-semibold">{article.title}</p>
                <p className="text-xs text-slate-400">{article.category}</p>
              </button>
            ))}
            {filtered.length === 0 ? (
              <p className="text-sm text-slate-400">
                ไม่พบบทความที่ตรงกับการค้นหา หากต้องการความช่วยเหลือ โปรดสร้าง
                Ticket ใหม่
              </p>
            ) : null}
          </div>
        </aside>
        <article className="rounded-2xl border border-slate-800 bg-slate-950/80 p-6">
          {activeArticle ? (
            <div className="space-y-4">
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-300">
                  {activeArticle.category}
                </p>
                <h2 className="mt-1 text-2xl font-semibold text-white">
                  {activeArticle.title}
                </h2>
                <p className="text-xs text-slate-400">
                  ปรับปรุงล่าสุด{' '}
                  {new Date(activeArticle.updatedAt).toLocaleString('th-TH')}
                </p>
              </div>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-200">
                {activeArticle.content}
              </p>
              <div className="rounded-lg border border-slate-800 bg-slate-900/70 p-4 text-xs text-slate-400">
                <p>คำค้นที่เกี่ยวข้อง: {activeArticle.keywords.join(', ')}</p>
                <p className="mt-2">
                  มีผู้ใช้งานบันทึกว่ามีประโยชน์ {activeArticle.helpfulCount}{' '}
                  ครั้ง
                </p>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-300">
              เลือกบทความจากด้านซ้ายเพื่อดูรายละเอียด
            </p>
          )}
        </article>
      </div>
    </div>
  )
}
