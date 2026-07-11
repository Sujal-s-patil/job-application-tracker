import { useState } from "react"
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom"
import ApplicationForm from "../components/ApplicationForm"
import { PageShell } from "../components/layout/PageShell"
import { Button } from "../components/ui/Button"
import { ErrorState } from "../components/ui/Feedback"
import { request, sanitizePayload } from "../lib/api"
import { normalizeApplicationValues, validateApplication } from "../lib/applicationForm"
import { useNotifications } from "../components/notifications/useNotifications"

function UpdateForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const location = useLocation()
    const { notify } = useNotifications()

    // The application record is handed to us via router state (from the
    // details modal's "Edit application" link) instead of being re-fetched
    // from the API. Dashboard already loaded every application once.
    const application = location.state?.application ?? null

    const [formData, setFormData] = useState(() =>
        application
            ? {
                  title: application.title ?? "",
                  roleApplied: application.roleApplied ?? "",
                  jobDescription: application.jobDescription ?? "",
                  applicationStatus: application.applicationStatus ?? "applied",
                  noteForApplied: application.noteForApplied ?? "",
                  noteForInterview: application.noteForInterview ?? "",
                  noteForAccepted: application.noteForAccepted ?? "",
                  noteForRejected: application.noteForRejected ?? "",
              }
            : null,
    )
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = validateApplication(formData)
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        setIsSubmitting(true)

        try {
            const payload = sanitizePayload(normalizeApplicationValues(formData))
            const response = await request(`/application/${id}`, {
                method: "PUT",
                body: payload,
            })

            if (response?.success) {
                navigate("/dashboard", {
                    replace: true,
                    state: { flashMessage: "Application updated successfully.", flashTone: "success" },
                })
            }
        } catch (error) {
            notify(error.message || "Unable to update the application.", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!id) {
        return <Navigate to="/dashboard" replace />
    }

    // No state means this route was hit directly (refresh, bookmark, shared
    // link) rather than via the dashboard's Edit link. Since we no longer
    // fetch a single application, we can't recover the record here — send
    // the user back rather than guessing or silently re-adding a fetch.
    if (!application || !formData) {
        return (
            <PageShell
                eyebrow="Applications"
                title="Update application"
                description="Edit the existing record and keep the data current."
            >
                <ErrorState
                    message="This application's data isn't available here. Open it from the dashboard to edit it."
                    onRetry={() => navigate("/dashboard")}
                />
            </PageShell>
        )
    }

    return (
        <PageShell
            eyebrow="Applications"
            title="Update application"
            description="Change the fields you need while keeping the rest of the record intact."
            actions={<Button variant="secondary" to="/dashboard">Back to dashboard</Button>}
        >
            <div className="mx-auto w-full max-w-3xl">
                <div className="surface p-6 sm:p-8">
                    <ApplicationForm
                        title={application?.title || "Application details"}
                        description="All existing values are prefilled. Save changes when you are done."
                        submitLabel="Update application"
                        cancelLabel="Cancel"
                        onCancel={() => navigate("/dashboard")}
                        onSubmit={handleSubmit}
                        values={formData}
                        errors={errors}
                        onChange={handleChange}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </PageShell>
    )
}


export default UpdateForm