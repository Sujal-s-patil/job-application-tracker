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
            <p onClick={() => setPanel(true)}>
                {info.firstName} {info.lastName}
            </p>

            {panel && (
                <div style={styles.overlay} onClick={() => setPanel(false)}>
                    <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
                        <p>full name : {info.firstName} {info.lastName}</p>
                        <p>email : {info.email}</p>
                        <div style={styles.justify}>
                            <button onClick={logout}>logout</button>
                            <button onClick={() => setPanel(false)}>close</button>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000
    },
    panel: {
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "10px",
        minWidth: "300px",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
    },
    justify:{
        display:"flex",
        justifyContent:"space-between"
    }
};

export default UserProfile;