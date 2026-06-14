export function PageShell({ eyebrow, title, description, actions, children }) {
  return (
    <main className="app-shell">
      <header className="flex flex-col gap-4 border-b border-slate-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl space-y-2">
          {eyebrow ? <p className="section-title">{eyebrow}</p> : null}
          <h1 className="page-heading">{title}</h1>
          {description ? <p className="muted max-w-2xl">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </header>

      <div className="py-6">{children}</div>
    </main>
  )
}
