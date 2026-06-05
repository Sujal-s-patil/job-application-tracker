import { useState, useEffect, useRef } from "react";

function Application({ p }) {
    const [panel, setPanel] = useState(false);
    const [deletePanel, setDeletePanel] = useState(false);
    const [applicationData, setApplicationData] = useState({});
    const deletePanelRef = useRef(null);
    useEffect(() => {
        if (deletePanel) {
            deletePanelRef.current?.focus()
        }
    }, [deletePanel])
    const api = import.meta.env.VITE_API_URL;
    const showApplicationDetails = async () => {
        try {
            const responce = await fetch(`${api}/application/${p.id}`, {
                method: "GET",
                credentials: "include"
            })
            const data = await responce.json();
            if (responce.ok && data.success) {
                setApplicationData(data.row[0])
            }
            setPanel(true)
        } catch (error) {
            console.error(error)
        }

    }
    const deleteApplication = async () => {
        try {
            const responce = await fetch(`${api}/application/${p.id}`, {
                method: "DELETE",
                credentials: "include"
            })
            if (responce.ok) {
                alert("deleted successfully");
                setPanel(false)
            }
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div style={styles.application} key={p.id} >
            <li onClick={showApplicationDetails}>
                <p>{p.title}</p>
                <p>{p.roleApplied} </p>
                <p>{p.jobDescription}</p>
            </li>
            {panel &&
                <div style={styles.overlay} onClick={() => setPanel(false)}>
                    <div style={styles.panel} onClick={(e) => e.stopPropagation()}>
                        {Object.entries(applicationData).map(([k, v]) =>
                            v ? <p>
                                <span>{k}</span> : <span>{v}</span>
                            </p> : ""
                        )}
                        <div style={{ display: "flex", justifyContent: "space-evenly" }}>
                            <button>update</button>
                            <button onClick={() => setDeletePanel(true)}>delete</button>
                            {deletePanel &&
                                <div
                                    ref={deletePanelRef}
                                    tabIndex={-1}
                                    role="dialog"
                                    aria-modal="true"
                                    style={styles.deletepanel}
                                >
                                    <p>are you sure you want to delete this</p>
                                    <button onClick={deleteApplication}>delete</button>
                                    <button onClick={() => setDeletePanel(false)}>cancel</button>
                                </div>
                            }
                            <button onClick={() => setPanel(false)}>Close</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

const styles = {
    application: {
        border: "1px solid black",
        margin: "5px",
        cursor: "pointer"
    },
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
        zIndex: 100
    },
    panel: {
        position: "relative",
        backgroundColor: "white",
        width: "500px",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)"
    },
    deletepanel: {
        position: "absolute",
        zIndex: 500,
        border: "1px solid black",
        borderRadius: "4px",
        top: "40%",
        left: "25%",
        backgroundColor: "white",
        padding: "10px"
    }

}


export default Application