export function InlineSpinner({ className = "" }) {
  return (
    <svg
      className={`h-4 w-4 animate-spin ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" className="opacity-20" stroke="currentColor" strokeWidth="4" />
      <path
        d="M22 12a10 10 0 0 0-10-10"
        className="opacity-90"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function FullPageLoader({ title = "Loading", message = "Fetching the latest data." }) {
  return (
    <div className="app-shell items-center justify-center">
      <div className="surface flex w-full max-w-md items-center gap-4 p-6">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white">
          <InlineSpinner />
        </span>
        <div>
          <h2 className="text-base font-semibold text-slate-950">{title}</h2>
          <p className="muted">{message}</p>
        </div>
      </div>
    </div>
  )
}

export function SkeletonBlock({ className = "" }) {
  return <div className={`animate-pulse rounded-2xl bg-slate-100 ${className}`} aria-hidden="true" />
}

export function SkeletonList({ rows = 3 }) {
  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="surface p-5">
          <div className="space-y-3">
            <SkeletonBlock className="h-5 w-40" />
            <SkeletonBlock className="h-4 w-72" />
            <SkeletonBlock className="h-4 w-56" />
          </div>
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="surface grid gap-5 p-8 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M7 6h10M7 10h10M7 14h6" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M5 4.5h14A1.5 1.5 0 0 1 20.5 6v12A1.5 1.5 0 0 1 19 19.5H5A1.5 1.5 0 0 1 3.5 18V6A1.5 1.5 0 0 1 5 4.5Z" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="muted mx-auto max-w-xl">{message}</p>
      </div>
      {action}
    </div>
  )
}

export function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="surface grid gap-5 p-8 text-center sm:p-10">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
        <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6" aria-hidden="true">
          <path d="M12 8v5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
          <path d="M12 16.5h.01" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M10.3 4.5h3.4l6.3 10.75a1.75 1.75 0 0 1-1.5 2.63H5.5A1.75 1.75 0 0 1 4 15.25L10.3 4.5Z" stroke="currentColor" strokeWidth="1.75" />
        </svg>
      </div>
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-slate-950">{title}</h2>
        <p className="muted mx-auto max-w-xl">{message}</p>
      </div>
      {onRetry ? (
        <div>
          <button type="button" className="btn btn-primary" onClick={onRetry}>
            Try again
          </button>
        </div>
      ) : null}
    </div>
  )
}