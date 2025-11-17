import clsx from 'clsx'

const styles = {
  Low: 'bg-slate-700 text-slate-200',
  Normal: 'bg-blue-700 text-blue-100',
  High: 'bg-amber-500 text-amber-950',
  Critical: 'bg-rose-500 text-rose-50',
}

export function PriorityTag({ priority }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide',
        styles[priority] ?? styles.Normal,
      )}
    >
      {priority}
    </span>
  )
}
