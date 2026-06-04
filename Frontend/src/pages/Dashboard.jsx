import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Application from "./Application"
function Dashboard() {
  const [data, setData] = useState([])
  const api = import.meta.env.VITE_API_URL;
  useEffect(() => {
    async function fetchApplication() {
      try {
        const responce = await fetch(`${api}/application`, {
          method: "GET",
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
          },
          credentials: "include"
        })
        const applicationData = await responce.json();
        setData(applicationData.rows || applicationData || [])
      } catch (error) {
        console.error(error)
      }
    }
    fetchApplication()
  }, [])

  return (
    <main>
      <div className="navbar">
        <h1>Dashboard</h1>
        <p>profile</p>
        <Link to="/add" className="button">add application</Link>
      </div>
      <div className="applications">
        <ul>
          {data && data.map(item => (
            <Application p={item} />
          ))}
        </ul>
      </div>
    </main>
  )
}

export default Dashboard