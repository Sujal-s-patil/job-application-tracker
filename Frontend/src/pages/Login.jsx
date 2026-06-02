import { useState } from "react"

function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    //email, password


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch('http://localhost:8000/user/login', {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        })
            
            .then((data) => {
                console.log(data)
            })
    }
    return (
        <div >
            <form onSubmit={handleSubmit}>
                <span>Enter email</span>  <input type="email" name="email" onChange={(e) => setEmail(e.target.value)} /><br />
                <span>Enter password</span>  <input type="password" name="password" onChange={(e) => setPassword(e.target.value)} /><br />
                <button type="submit">Submit</button>
            </form>
        </div>

    )
}

export default Login