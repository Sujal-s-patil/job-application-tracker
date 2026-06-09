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
      <h1 className="mt-2 pl-5 font-bold leading-tight text-4xl">Job Application Tracker</h1>
      <div className="flex border-b justify-between pt-2 pb-2 pl-10 pr-10" >
        <Link to="/add">add application</Link>
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


export default Dashboard