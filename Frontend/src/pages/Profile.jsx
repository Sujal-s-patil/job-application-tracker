import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserProfile({ info }) {
    const [panel, setPanel] = useState(false)
    const navigate = useNavigate();
    const logout = async () => {
        localStorage.removeItem("userInfo");
        await fetch(`${import.meta.env.VITE_API_URL}/user/logout`, {
            method: "GET",
            credentials: "include"
        });

        navigate("/login");
    };

    return (
        <div>

            <div onClick={() => setPanel(true)} className="border cursor-pointer rounded-[3px] p-1">
                {info.firstName} {info.lastName}
            </div>
            {panel && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]" onClick={() => setPanel(false)}>
                    <div className="bg-white  min-w-80 p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()}>
                        <p>full name : {info.firstName} {info.lastName}</p>
                        <p>email : {info.email}</p>
                        <div className="flex justify-between mt-3">
                            <button onClick={logout}>logout</button>
                            <button onClick={() => setPanel(false)}>close</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default UserProfile;