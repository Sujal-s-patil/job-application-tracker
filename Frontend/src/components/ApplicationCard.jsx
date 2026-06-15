import { Button } from "./ui/Button"

const statusStyles = {
  applied: "bg-slate-100 text-slate-700",
  interview: "bg-amber-50 text-amber-700",
  accepted: "bg-emerald-50 text-emerald-700",
  rejected: "bg-rose-50 text-rose-700",
}

export default function ApplicationCard({ application, onOpen }) {
  const status = application.applicationStatus ?? "applied"

  return (
    <article className="surface flex h-full flex-col justify-between p-5 transition hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-42px_rgba(15,23,42,0.35)]">
      <div className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <h3 className="text-base font-semibold text-slate-950">{application.title}</h3>
            <p className="text-sm text-slate-500">{application.roleApplied}</p>
          </div>
          <span className={`status-badge ${statusStyles[status] ?? statusStyles.applied}`}>
            {status}
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-600 line-clamp-3">{application.jobDescription}</p>
      </div>
      <div className="mt-5 flex items-center justify-end gap-3">
        <Button type="button" variant="secondary" className="px-3 py-2 text-xs" onClick={() => onOpen(application.id)}>
          View details
        </Button>
      </div>
    </article>
  )
}