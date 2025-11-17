import clsx from 'clsx'

const statusStyles = {
  Open: 'bg-blue-500/20 text-blue-300 ring-1 ring-inset ring-blue-500/30',
  'In Progress': 'bg-emerald-500/20 text-emerald-300 ring-emerald-500/30',
  Pending: 'bg-amber-500/20 text-amber-300 ring-amber-500/30',
  Resolved: 'bg-indigo-500/20 text-indigo-300 ring-indigo-500/30',
  Closed: 'bg-slate-700/40 text-slate-300 ring-slate-500/30',
  Canceled: 'bg-rose-500/20 text-rose-300 ring-rose-500/30',
}

export function TicketStatusBadge({ status }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold uppercase tracking-tight',
        statusStyles[status] ?? statusStyles.Open,
      )}
    >
      {status}
    </span>
  )
}
