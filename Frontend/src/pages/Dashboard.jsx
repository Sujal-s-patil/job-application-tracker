import { useEffect, useRef, useState } from "react"
import { useLocation } from "react-router-dom"
import ApplicationCard from "../components/ApplicationCard"
import ApplicationDetailsModal from "../components/ApplicationDetailsModal"
import Profile from "./Profile"
import { PageShell } from "../components/layout/PageShell"
import { Button } from "../components/ui/Button"
import { EmptyState, ErrorState, SkeletonList } from "../components/ui/Feedback"
import { request } from "../lib/api"
import { readUserInfo } from "../utils/storage"
import { useNotifications } from "../components/notifications/useNotifications"

function Dashboard() {
  const [applications, setApplications] = useState([])
  const [status, setStatus] = useState("loading")
  const [error, setError] = useState("")
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [userInfo] = useState(() => readUserInfo())
  const location = useLocation()
  const { notify } = useNotifications()
  const hasShownFlashMessageRef = useRef(false)

  useEffect(() => {
    if (status !== "loading") {
      return undefined
    }

    let active = true

    async function fetchApplications() {
      setError("")

      try {
        const response = await request("/application")
        if (!active) {
          return
        }

        setApplications(response?.rows ?? [])
        setStatus("ready")
      } catch (fetchError) {
        if (!active) {
          return
        }

        setError(fetchError.message || "Unable to load your applications.")
        setStatus("error")
      }
    }

    fetchApplications()

    return () => {
      active = false
    }
  }, [status])

  useEffect(() => {
    const flashMessage = location.state?.flashMessage

    if (selectedApplicationId || !flashMessage || hasShownFlashMessageRef.current) {
      return
    }

    hasShownFlashMessageRef.current = true
    notify(flashMessage, location.state?.flashTone || "success")
    window.history.replaceState({}, document.title)
  }, [location.state?.flashMessage, location.state?.flashTone, notify, selectedApplicationId])

  const handleRetry = () => {
    setStatus("loading")
  }

  const handleApplicationDeleted = (deletedId) => {
    setApplications((current) => current.filter((application) => application.id !== deletedId))
    setSelectedApplication(null)
  }

  const statuses = ["applied", "interview", "accepted", "rejected"]

  const handleApplicationStatusChange = async (applicationId, nextStatus) => {
    const safeStatus = statuses.includes(nextStatus) ? nextStatus : "applied"
    const previousApplications = applications

    setApplications((current) =>
      current.map((application) => (application.id === applicationId ? { ...application, applicationStatus: safeStatus } : application)),
    )

    try {
      await request(`/application/${applicationId}/status`, {
        method: "PATCH",
        body: { applicationStatus: safeStatus },
      })
    } catch (updateError) {
      setApplications(previousApplications)
      setError(updateError.message || "Unable to update application status.")
    }
  }
  const groupedApplications = applications.reduce(
    (groups, application) => {
      const statusKey = application.applicationStatus ?? "applied"
      groups[statusKey] = groups[statusKey] || []
      groups[statusKey].push(application)
      return groups
    },
    {
      applied: [],
      interview: [],
      accepted: [],
      rejected: [],
    },
  )

  const content =
    status === "loading" ? (
      <SkeletonList rows={4} />
    ) : status === "error" ? (
      <ErrorState title="Unable to load applications" message={error} onRetry={handleRetry} />
    ) : applications.length === 0 ? (
      <EmptyState
        title="No applications yet"
        message="Start by adding your first application. You can track the role, notes, and status from one place."
        action={<Button to="/add">Add application</Button>}
      />
    ) : (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statuses.map((statusKey) => (
          <section
            key={statusKey}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              const draggedApplicationId = event.dataTransfer.getData("text/plain")
              if (draggedApplicationId) {
                handleApplicationStatusChange(Number(draggedApplicationId), statusKey)
              }
            }}
            className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50/70 p-5"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-600">{statusKey}</h2>
              <span className="text-xs text-slate-500">{groupedApplications[statusKey].length}</span>
            </div>
            <div className="space-y-4">
              {groupedApplications[statusKey].length > 0 ? (
                groupedApplications[statusKey].map((application) => (
                  <ApplicationCard
                    key={application.id}
                    application={application}
                    onOpen={setSelectedApplication}
                    draggable
                    onDragStart={(event) => {
                      event.dataTransfer.setData("text/plain", String(application.id))
                      event.dataTransfer.effectAllowed = "move"
                    }}
                  />
                ))
              ) : (
                <p className="text-sm text-slate-500">No applications in this status.</p>
              )}
            </div>
          </section>
        ))}
      </div>
    )

  return (
    <PageShell
      eyebrow="Dashboard"
      title="Job application tracker"
      description={`Track ${applications.length} application${applications.length === 1 ? "" : "s"} with a clean overview, detailed notes, and fast updates.`}
      actions={
        <>
          <Button to="/add">Add application</Button>
          {userInfo ? <Profile info={userInfo} /> : null}
        </>
      }
    >
      {content}

      {selectedApplication ? (
        <ApplicationDetailsModal
          application={selectedApplication}
          onClose={() => setSelectedApplication(null)}
          onDelete={handleApplicationDeleted}
        />
      ) : null}
    </PageShell>
  )
}

export default Dashboard