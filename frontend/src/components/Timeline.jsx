import dayjs from 'dayjs'
import { mockUsers } from '../data/mockData'

function resolveUserName(userId) {
  return mockUsers.find((user) => user.id === userId)?.name ?? userId
}

export function Timeline({ items }) {
  if (!items?.length) return null
  return (
    <ol className="space-y-3 border-l border-slate-800 pl-4">
      {items.map((item, index) => (
        <li key={`${item.status}-${index}`} className="space-y-1">
          <p className="text-sm font-semibold text-slate-200">{item.status}</p>
          <p className="text-xs text-slate-400">
            {resolveUserName(item.changedBy)} •{' '}
            {dayjs(item.changedAt).format('DD MMM YYYY HH:mm')}
          </p>
          {item.note ? (
            <p className="text-xs text-slate-500">{item.note}</p>
          ) : null}
        </li>
      ))}
    </ol>
  )
}
