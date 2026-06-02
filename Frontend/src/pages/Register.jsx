import { useState } from "react"

function Register() {
    const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" })
    // firstName, lastName, email, password
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    }
    const handleSubmit = (e) => {
     
        console.log("form submit fired")
        console.log(formData);
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <span>Enter first name:</span>  <input type="text" name="firstName" onChange={handleChange} /><br />
                <span>Enter last name:</span>  <input type="text" name="lastName" onChange={handleChange} /><br />
                <span>Enter email</span>  <input type="email" name="email" onChange={handleChange} /><br />
                <span>Enter password</span>  <input type="password" name="password" onChange={handleChange} /><br />
                <button type="submit">Submit</button>
            </form>
        </>
    )
}

export default Register