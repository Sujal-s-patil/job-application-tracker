import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
function Register() {
    const navigate = useNavigate()
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" })
    // firstName, lastName, email, password
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        const api = import.meta.env.VITE_API_URL
        try {
            const response = await fetch(`${api}/user/register`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify(formData)

            })
            const data = await response.json()

            if (response.ok && data.success) {
                alert("login successful")
                navigate("/login")
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h2>register page</h2>
                <span>Enter first name:</span><br />  <input type="text" name="firstName" onChange={handleChange} /><br />
                <span>Enter last name:</span> <br /> <input type="text" name="lastName" onChange={handleChange} /><br />
                <span>Enter email</span> <br /> <input type="email" name="email" onChange={handleChange} /><br />
                <span>Enter password</span>  <br /><input type="password" name="password" onChange={handleChange} /><br />
                <button type="submit">Submit</button>
                <p>Back to login <Link to="/login">login</Link></p>
            </form>
        </div>
    )
}

export default Register