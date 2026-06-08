import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
function UpdateForm() {
    const api = import.meta.env.VITE_API_URL;
    const location = useLocation();
    const p = location.state?.p;
    const [formData, setFormData] = useState({
        title: "",
        roleApplied: "",
        jobDescription: "",
        applicationStatus: "applied",
        noteForApplied: "",
        noteForInterview: '',
        noteForAccepted: '',
        noteForRejected: ''
    })


    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const formBody = Object.fromEntries(Object.entries(formData).filter(([_, v]) => v !== ''))
            const responce = await fetch(`${api}/application/${p.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(formBody)
            })
            const data = await responce.json();
            if (responce.ok && data.success) {
                alert("Updated successfully")
            }
            console.log(data)

        } catch (error) {
            console.error(error)
        }
    }

    return (
        <div className="form">
            <form onSubmit={handleSubmit}>
                <h2>Add application details to update</h2>
                <p>title</p>
                <input type="text" value={p.title} name="title" onChange={handleChange} />
                <p>role applied for</p>
                <input type="text" value={p.roleApplied} name="roleApplied" onChange={handleChange} />
                <p>job description</p>
                <input type="text" value={p.jobDescription} name="jobDescription" onChange={handleChange} />
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
                <textarea value={p.noteForApplied} name="noteForApplied" onChange={handleChange} placeholder="enter your note"></textarea><br />
                <p>note (Interview)</p>
                <textarea value={p.noteForApplied} name="noteForInterview" onChange={handleChange} placeholder="enter your note"></textarea><br />
                <p>note (Accepted)</p>
                <textarea value={p.noteForAccepted} name="noteForAccepted" onChange={handleChange} placeholder="enter your note"></textarea><br />
                <p>note (rejected)</p>
                <textarea value={p.noteForRejected} name="noteForRejected" onChange={handleChange} placeholder="enter your note"></textarea><br />
                <button type="submit">Submit</button> <p>   </p>
                <Link to="/dashboard">go to dashboard</Link>
            </form>
        </div>
    )
}


export default UpdateForm