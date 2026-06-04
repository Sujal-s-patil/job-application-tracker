import { useState } from "react";
import { useNavigate } from "react-router-dom"
function UserProfile({ info }) {
    const [panel, setPanel] = useState(false)
    const navigate = useNavigate();
    const logout = async () => {
        localStorage.removeItem("userInfo");
        await fetch(`${import.meta.env.VITE_API_URL}/user/logout`, {
            method: "GET",
            credentials: "include"
        })

        navigate("/login")
    }
    return (
        <div >
            <p onClick={() => setPanel(true)}> {info.firstName} {info.lastName} </p>

            {panel && <div>
                <p> {info.firstName} {info.lastName} </p>
                <p> {info.email} </p>
                <button onClick={logout}>logout</button>
            </div>}
        </div>
    )
}
export default UserProfile