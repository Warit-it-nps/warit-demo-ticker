export function PageHeader({ title, description, actions }) {
  return (
    <header className="flex flex-col gap-4 text-left sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
        {description ? (
          <p className="mt-1 text-sm text-slate-300">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </header>
  )
}
