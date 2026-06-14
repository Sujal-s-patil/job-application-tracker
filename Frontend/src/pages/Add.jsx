import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ApplicationForm from "../components/ApplicationForm"
import { PageShell } from "../components/layout/PageShell"
import { Button } from "../components/ui/Button"
import { request, sanitizePayload } from "../lib/api"
import { initialApplicationValues, normalizeApplicationValues, validateApplication } from "../lib/applicationForm"
import { useNotifications } from "../components/notifications/useNotifications"

function Add() {
    const navigate = useNavigate()
    const { notify } = useNotifications()
    const [formData, setFormData] = useState(initialApplicationValues)
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
            const response = await request("/application", {
                method: "POST",
                body: payload,
            })

            if (response?.success) {
                notify("Application created successfully.", "success")
                navigate("/dashboard", {
                    replace: true,
                    state: { flashMessage: "Application created successfully.", flashTone: "success" },
                })
            }
        } catch (error) {
            notify(error.message || "Unable to create the application.", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageShell
            eyebrow="Applications"
            title="Add a new application"
            description="Capture the role, description, status, and notes so you can follow up without digging through other tools."
            actions={<Button variant="secondary" to="/dashboard">Back to dashboard</Button>}
        >
            <div className="mx-auto w-full max-w-3xl">
                <div className="surface p-6 sm:p-8">
                    <ApplicationForm
                        title="Application details"
                        description="Every required field is validated before submission. Optional notes are preserved when provided."
                        submitLabel="Save application"
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


export default Add
