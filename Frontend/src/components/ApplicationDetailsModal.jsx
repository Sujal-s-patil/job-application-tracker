import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import { Button } from "./ui/Button"
import { ErrorState, SkeletonBlock } from "./ui/Feedback"
import { request } from "../lib/api"
import { useNotifications } from "./notifications/useNotifications"

function DetailRow({ label, value }) {
  if (!value) {
    return null
  }

  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-800 whitespace-pre-wrap">{value}</p>
    </div>
  )
}

function DetailSkeleton() {
  return (
    <div className="grid gap-3">
      <SkeletonBlock className="h-6 w-2/3" />
      <SkeletonBlock className="h-4 w-1/2" />
      <SkeletonBlock className="h-24 w-full" />
      <SkeletonBlock className="h-24 w-full" />
    </div>
  )
}

export default function ApplicationDetailsModal({ applicationId, onClose, onDelete }) {
  const { notify } = useNotifications()
  const [status, setStatus] = useState("loading")
  const [application, setApplication] = useState(null)
  const [error, setError] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [reloadIndex, setReloadIndex] = useState(0)
  const closeButtonRef = useRef(null)

  useEffect(() => {
    let active = true

    async function loadApplication() {
      setStatus("loading")
      setError("")

      try {
        const response = await request(`/application/${applicationId}`)
        if (!active) {
          return
        }

        setApplication(response?.row?.[0] ?? null)
        setStatus("ready")
      } catch (loadError) {
        if (!active) {
          return
        }

        setError(loadError.message || "Unable to load application details.")
        setStatus("error")
      }
    }

    if (applicationId) {
      loadApplication()
    }

    return () => {
      active = false
    }
  }, [applicationId, reloadIndex])

  useEffect(() => {
    if (showDeleteConfirm) {
      closeButtonRef.current?.focus()
    }
  }, [showDeleteConfirm])

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        if (showDeleteConfirm) {
          setShowDeleteConfirm(false)
          return
        }

        onClose()
      }
    }

    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose, showDeleteConfirm])

  const handleDelete = async () => {
    setIsDeleting(true)

    try {
      await request(`/application/${applicationId}`, { method: "DELETE" })
      notify("Application deleted.", "success")
      onDelete(applicationId)
      onClose()
    } catch (deleteError) {
      notify(deleteError.message || "Unable to delete this application.", "error")
    } finally {
      setIsDeleting(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-950/55 px-4 py-8 backdrop-blur-sm"
      onClick={onClose}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="application-details-title"
        className="surface relative w-full max-w-3xl overflow-hidden p-0"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="border-b border-slate-200 px-6 py-5 sm:px-7">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="section-title">Application details</p>
              <h2 id="application-details-title" className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                {application?.title ?? "Application"}
              </h2>
            </div>
            <button
              ref={closeButtonRef}
              type="button"
              className="btn btn-ghost h-10 px-3"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:px-7">
          {status === "loading" ? <DetailSkeleton /> : null}
          {status === "error" ? <ErrorState title="Unable to load details" message={error} onRetry={() => setReloadIndex((current) => current + 1)} /> : null}
          {status === "ready" && application ? (
            <div className="grid gap-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailRow label="Role applied" value={application.roleApplied} />
                <DetailRow label="Status" value={application.applicationStatus} />
              </div>
              <DetailRow label="Job description" value={application.jobDescription} />
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailRow label="Applied note" value={application.noteForApplied} />
                <DetailRow label="Interview note" value={application.noteForInterview} />
                <DetailRow label="Accepted note" value={application.noteForAccepted} />
                <DetailRow label="Rejected note" value={application.noteForRejected} />
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-slate-200 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <Link to={`/update/${applicationId}`} className="btn btn-secondary">
              Edit application
            </Link>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="danger" onClick={() => setShowDeleteConfirm(true)}>
                Delete
              </Button>
              <Button type="button" variant="secondary" onClick={onClose}>
                Done
              </Button>
            </div>
          </div>
        </div>

        {showDeleteConfirm ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-950/45 px-4">
            <div className="surface w-full max-w-md p-6 shadow-[0_30px_100px_-50px_rgba(15,23,42,0.5)]">
              <h3 className="text-lg font-semibold text-slate-950">Delete this application?</h3>
              <p className="muted mt-2">
                This action cannot be undone. The record will be removed permanently from your tracker.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
                <Button type="button" variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
                  Cancel
                </Button>
                <Button type="button" variant="danger" isLoading={isDeleting} onClick={handleDelete}>
                  Delete permanently
                </Button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}