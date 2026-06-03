import { useState } from "react"
function Add() {
    const [formData, setFormData] = useState({ title: "", roleApplied: "", jobDescription: "", applicationStatus: "applied", noteForApplied: "" })
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const api = import.meta.env.VITE_API_URL;
            const responce = await fetch(`${api}/application`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formData)
            })
            const data = await responce.json();
            if (responce.ok && data.success) {
                alert("submitted")
            }
            console.log(data)

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h2>Add application details</h2>
                <p>title</p>
                <input type="text" name="title" onChange={handleChange} />
                <p>role applied for</p>
                <input type="text" name="roleApplied" onChange={handleChange} />
                <p>job description</p>
                <input type="text" name="jobDescription" onChange={handleChange} />
                <br /><br />  <span>application status   </span>
                <select
                    name="applicationStatus"
                    value={formData.applicationStatus}
                    onChange={handleChange}
                >
                    <option value="applied">applied</option>
                    <option value="interview">interview</option>
                    <option value="accepted">accepted</option>
                    <option value="rejected">rejected</option>
                </select>
                <p>note (applied)</p>
                <textarea name="noteForApplied" onChange={handleChange} placeholder="enter your note"></textarea><br />
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}


export default Add

function get() {
    fetch("http://localhost:8000/application",{credentials:"include"})
        .then(reponce => reponce.json()).then(data => console.log(data))
}