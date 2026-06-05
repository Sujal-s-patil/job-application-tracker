import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Application from "./Application";
import Profile from "./Profile";

function Dashboard() {
  const [data, setData] = useState([])
  const [userInfo, setUserInfo] = useState({})
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
    function getUserInfo() {
      const object = localStorage.getItem('userInfo');
      const data = JSON.parse(object)
      setUserInfo(data)
    }
    getUserInfo()
    fetchApplication()
  }, [])

  return (
    <main>
      <h1>Job Application Tracker</h1>
      <div style={styles.navbar}>
        <Link to="/add" style={styles.link}>add application</Link>
        {userInfo && <Profile info={userInfo} />}
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

const styles = {
  navbar: {
    display: "flex",
    borderBottom: "1px solid black",
    justifyContent: "space-between",
    paddingBottom: "3px",
    paddingLeft: "30px",
    paddingRight: "30px",
  },
  link: {
    border: "1px solid black",
    height: "fit-content",
    alignSelf: "center",
    textDecoration: "none",
    borderRadius: "4px",
  }
}

export default Dashboard