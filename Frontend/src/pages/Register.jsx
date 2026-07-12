import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useNotifications } from "../components/notifications/useNotifications"
import { PageShell } from "../components/layout/PageShell"
import { Button } from "../components/ui/Button"
import { InputField } from "../components/ui/Fields"
import { request } from "../lib/api"
import { validateUserData, normalizeUserData } from "../lib/userForm"
function Register() {
    const navigate = useNavigate()
    const { notify } = useNotifications()
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" })
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)



    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = validateUserData(formData, true)
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        setIsSubmitting(true)
        setFormError("")
        const body = normalizeUserData(formData, true)
        try {
            const response = await request("/user/register", {
                method: "POST",
                body
            })

            if (response?.success) {
                notify("Account created successfully. Sign in to continue.", "success")
                navigate("/login", { replace: true })
            }
        } catch (error) {
            const message = error.message || "Unable to create your account right now."
            setFormError(message)
            notify(message, "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageShell
            eyebrow="Authentication"
            title="Create your account"
            description="Set up a secure workspace for tracking applications, notes, and follow-ups in one place."
        >
            <div className="mx-auto w-full max-w-md">
                <form onSubmit={handleSubmit} className="surface space-y-5 p-6 sm:p-8" noValidate>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <InputField
                            id="firstName"
                            name="firstName"
                            type="text"
                            label="First name"
                            autoComplete="given-name"
                            value={formData.firstName}
                            onChange={handleChange}
                            error={errors.firstName}
                        />

                        <InputField
                            id="lastName"
                            name="lastName"
                            type="text"
                            label="Last name"
                            autoComplete="family-name"
                            value={formData.lastName}
                            onChange={handleChange}
                            error={errors.lastName}
                        />
                    </div>

                    <InputField
                        id="email"
                        name="email"
                        type="email"
                        label="Email"
                        autoComplete="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="you@example.com"
                    />

                    <InputField
                        id="password"
                        name="password"
                        type="password"
                        label="Password"
                        autoComplete="new-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="At least 8 characters"
                    />

                    {formError ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</p> : null}

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                        Create account
                    </Button>

                    <p className="text-sm text-slate-600">
                        Already have an account?{" "}
                        <Link to="/login" className="font-medium text-slate-950 underline-offset-4 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </PageShell>
    )
}

export default Register