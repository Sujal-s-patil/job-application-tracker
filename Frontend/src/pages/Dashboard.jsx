import { Link,useNavigate } from "react-router-dom"

function Dashboard() {
  const navigate = useNavigate()
  return (
    <main>
      <h1>Dashboard</h1>
      <Link to="/add" className="button">add application</Link>
    </main>
  )
}

export default Dashboard