import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { clearUserInfo } from "../utils/storage"
import { request } from "../lib/api"
import { useNotifications } from "../components/notifications/useNotifications"
import { Button } from "../components/ui/Button"
import { InputField } from "../components/ui/Fields"
import { Modal } from "../components/ui/Modal"

function UserProfile({ info }) {
    const [panel, setPanel] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(false)
    const [formData, setFormData] = useState({ email: info?.email || "", password: "" })
    const [errors, setErrors] = useState({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const navigate = useNavigate()
    const { notify } = useNotifications()

    const logout = async () => {
        try {
            await request("/user/logout", { method: "POST" })
        } finally {
            clearUserInfo()
            setPanel(false)
            notify("Signed out successfully.", "success")
            navigate("/login", { replace: true })
        }
    }

    const handleDeleteSubmit = async (event) => {
        event.preventDefault()

        const nextErrors = {}

        if (!formData.email.trim()) {
            nextErrors.email = "Email is required."
        }

        if (!formData.password.trim()) {
            nextErrors.password = "Password is required."
        }

        setErrors(nextErrors)

        if (Object.keys(nextErrors).length > 0) {
            return
        }

        setIsSubmitting(true)

        try {
            await request("/user/me", {
                method: "DELETE",
                body: {
                    email: formData.email.trim(),
                    password: formData.password,
                },
            })

            clearUserInfo()
            setDeleteAccount(false)
            setPanel(false)
            notify("Account deleted permanently.", "success")
            navigate("/login", { replace: true })
        } catch (error) {
            notify(error.message || "Unable to delete the account.", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleChange = (event) => {
        const { name, value } = event.target
        setFormData((current) => ({ ...current, [name]: value }))
    }

    return (
        <>
            <button type="button" onClick={() => setPanel(true)} className="btn btn-secondary px-3 py-2 text-sm">
                {info.firstName} {info.lastName}
            </button>

            <Modal
                open={panel}
                onClose={() => setPanel(false)}
                title="Account"
                description="Review your profile, sign out, or remove the account permanently."
                actions={
                    <>
                        <Button variant="secondary" onClick={() => setPanel(false)}>Close</Button>
                        <Button variant="danger" onClick={() => setDeleteAccount(true)}>Delete account</Button>
                    </>
                }
            >
                <div className="grid gap-3 text-sm text-slate-700">
                    <p><span className="font-medium text-slate-950">Name:</span> {info.firstName} {info.lastName}</p>
                    <p><span className="font-medium text-slate-950">Email:</span> {info.email}</p>
                    <Button variant="secondary" onClick={logout}>Sign out</Button>
                </div>
            </Modal>

            <Modal
                open={deleteAccount}
                onClose={() => setDeleteAccount(false)}
                title="Delete account"
                description="Confirm with your email and password to permanently delete this account."
                actions={
                    <>
                        <Button variant="secondary" onClick={() => setDeleteAccount(false)} disabled={isSubmitting}>Cancel</Button>
                        <Button variant="danger" type="submit" form="delete-account-form" isLoading={isSubmitting}>
                            Delete permanently
                        </Button>
                    </>
                }
            >
                <form id="delete-account-form" onSubmit={handleDeleteSubmit} className="grid gap-4">
                    <InputField
                        id="delete-email"
                        name="email"
                        type="email"
                        label="Email"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                    <InputField
                        id="delete-password"
                        name="password"
                        type="password"
                        label="Password"
                        value={formData.password}
                        onChange={handleChange}
                        error={errors.password}
                    />
                </form>
            </Modal>
        </>
    )
}

export default UserProfile;