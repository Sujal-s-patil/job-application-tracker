import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useNotifications } from "../components/notifications/useNotifications"
import { PageShell } from "../components/layout/PageShell"
import { Button } from "../components/ui/Button"
import { InputField } from "../components/ui/Fields"
import { request } from "../lib/api"
import { saveUserInfo } from "../utils/storage"
import { validateUserData, normalizeUserData } from "../lib/userForm"
function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" })
    const [errors, setErrors] = useState({})
    const [formError, setFormError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const location = useLocation()
    const { notify } = useNotifications()
    const from = location.state?.from?.pathname || "/dashboard"



    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((current) => ({ ...current, [name]: value }))
    }

    const handleSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = validateUserData(formData)
        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        setIsSubmitting(true)
        setFormError("")
        const body = normalizeUserData(formData)
        try {
            const data = await request("/user/login", {
                method: "POST",
                body
            })

            if (data?.success) {
                saveUserInfo(data.userInfo)
                notify("Signed in successfully.", "success")
                navigate(from, { replace: true })
            }
        } catch (error) {
            const message = error.message || "Unable to sign in right now."
            setFormError(message)
            notify(message, "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <PageShell
            eyebrow="Authentication"
            title="Welcome back"
            description="Sign in to continue tracking applications, status changes, and account activity."
        >
            <div className="mx-auto w-full max-w-md">
                <form onSubmit={handleSubmit} className="surface space-y-5 p-6 sm:p-8" noValidate>
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
                        autoComplete="current-password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="••••••••"
                    />

                    {formError ? <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</p> : null}

                    <Button type="submit" className="w-full" isLoading={isSubmitting}>
                        Sign in
                    </Button>

                    <p className="text-sm text-slate-600">
                        Don&apos;t have an account?{" "}
                        <Link to="/register" className="font-medium text-slate-950 underline-offset-4 hover:underline">
                            Create one
                        </Link>
                    </p>
                </form>
            </div>
        </PageShell>
    )
}

export default Login