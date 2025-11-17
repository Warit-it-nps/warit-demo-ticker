import { NavLink } from 'react-router-dom'
import clsx from 'clsx'

export function PrimaryNav({ items }) {
  return (
    <nav className="flex flex-wrap gap-2">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            clsx(
              'rounded-lg px-3 py-1.5 text-sm font-medium transition',
              isActive
                ? 'bg-emerald-500 text-emerald-950 shadow-sm'
                : 'bg-slate-800 text-slate-200 hover:bg-slate-700 hover:text-white',
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  )
}
