export function StatsCard({ label, value, hint }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-4 shadow-sm">
      <p className="text-sm font-medium text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-500">{hint}</p> : null}
    </div>
  )
}
