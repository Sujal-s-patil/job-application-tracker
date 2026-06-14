export function validateUserData(formData, register = false) {
    const nextErrors = {};
    if (!formData.email.trim()) {
        nextErrors.email = "Email is required"
    }
    if (!formData.password.trim()) {
        nextErrors.password = "Password is required"
    }
    if (register && !formData.firstName.trim()) {
        nextErrors.firstName = "First name is required"
    }
    if (register && !formData.lastName.trim()) {
        nextErrors.lastName = "Last name is required"
    }
    return nextErrors
}


export function normalizeUserData(values, register = false) {
    const body = {};
    body.email = values.email.trim()
    body.password = values.password.trim()

    if (register) {
        body.firstName = values.firstName.trim()
        body.lastName = values.lastName.trim()
    }
    return body
}