import { useState } from "react"
import { useNavigate, Link } from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

    //email, password
    const handleSubmit = async (e) => {
        e.preventDefault();
        const api = import.meta.env.VITE_API_URL
        try {
            const response = await fetch(`${api}/user/login`, {
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                },
                credentials: 'include',
                body: JSON.stringify({ email, password })
            })

            const data = await response.json()

            if (response.ok && data.success) {
                navigate("/dashboard")
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="form" >
            <form onSubmit={handleSubmit}>
                <h2>login page</h2>
                <span>Enter email</span> <br /> <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} /><br />
                <span>Enter password</span> <br /> <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} /><br />
                <button type="submit">Submit</button>
                <p>Dont have account ?  <Link to="/register">register</Link></p>
            </form>
        </div>

    )
}

export default Login