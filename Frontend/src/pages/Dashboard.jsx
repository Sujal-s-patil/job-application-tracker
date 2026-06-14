import { useEffect, useState } from "react"
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
  const [selectedApplicationId, setSelectedApplicationId] = useState(null)
  const [userInfo] = useState(() => readUserInfo())
  const location = useLocation()
  const { notify } = useNotifications()

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
    if (selectedApplicationId || !location.state?.flashMessage) {
      return
    }

    notify(location.state.flashMessage, location.state.flashTone || "success")
    window.history.replaceState({}, document.title)
  }, [location.state, notify, selectedApplicationId])

  const handleRetry = () => {
    setStatus("loading")
  }

  const handleApplicationDeleted = (deletedId) => {
    setApplications((current) => current.filter((application) => application.id !== deletedId))
    setSelectedApplicationId(null)
  }

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
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {applications.map((application) => (
          <ApplicationCard key={application.id} application={application} onOpen={setSelectedApplicationId} />
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

      {selectedApplicationId ? (
        <ApplicationDetailsModal
          applicationId={selectedApplicationId}
          onClose={() => setSelectedApplicationId(null)}
          onDelete={handleApplicationDeleted}
        />
      ) : null}
    </PageShell>
  )
}

export default Dashboard