import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import ApplicationForm from "../components/ApplicationForm"
import { PageShell } from "../components/layout/PageShell"
import { Button } from "../components/ui/Button"
import { ErrorState, FullPageLoader } from "../components/ui/Feedback"
import { request, sanitizePayload } from "../lib/api"
import { initialApplicationValues, normalizeApplicationValues, validateApplication } from "../lib/applicationForm"
import { useNotifications } from "../components/notifications/useNotifications"

function UpdateForm() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { notify } = useNotifications()
    const [status, setStatus] = useState("loading")
    const [application, setApplication] = useState(null)
    const [formData, setFormData] = useState(initialApplicationValues)
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        let active = true

        async function loadApplication() {
            try {
                const response = await request(`/application/${id}`)
                if (!active) {
                    return
                }

                const nextApplication = response?.row?.[0] ?? null
                setApplication(nextApplication)

                if (nextApplication) {
                    setFormData({
                        title: nextApplication.title ?? "",
                        roleApplied: nextApplication.roleApplied ?? "",
                        jobDescription: nextApplication.jobDescription ?? "",
                        applicationStatus: nextApplication.applicationStatus ?? "applied",
                        noteForApplied: nextApplication.noteForApplied ?? "",
                        noteForInterview: nextApplication.noteForInterview ?? "",
                        noteForAccepted: nextApplication.noteForAccepted ?? "",
                        noteForRejected: nextApplication.noteForRejected ?? "",
                    })
                    setStatus("ready")
                    return
                }

                setStatus("error")
            } catch (error) {
                if (!active) {
                    return
                }

                setStatus("error")
                notify(error.message || "Unable to load application data.", "error")
            }
        }

        if (id) {
            loadApplication()
        }

        return () => {
            active = false
        }
    }, [id, notify])

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
                notify("Application updated successfully.", "success")
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

    if (status === "loading") {
        return <FullPageLoader title="Loading application" message="Fetching the current application data." />
    }

    if (status === "error") {
        return (
            <PageShell eyebrow="Applications" title="Update application" description="Edit the existing record and keep the data current.">
                <ErrorState message="The application could not be loaded. Return to the dashboard and try again." onRetry={() => navigate("/dashboard")} />
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