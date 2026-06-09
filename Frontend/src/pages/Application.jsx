import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
function Application({ p }) {
    const api = import.meta.env.VITE_API_URL;
    const [panel, setPanel] = useState(false);
    const [deletePanel, setDeletePanel] = useState(false);
    const [applicationData, setApplicationData] = useState({});
    const deletePanelRef = useRef(null);
    useEffect(() => {
        if (deletePanel) {
            deletePanelRef.current?.focus()
        }
    }, [deletePanel])
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
        <div className="m-[5px] border cursor-pointer" key={p.id} >
            <li onClick={showApplicationDetails}>
                <p><strong>Title</strong> : {p.title}</p>
                <p><strong>Role Applied for</strong> : {p.roleApplied} </p>
                <p><strong>job description</strong> : {p.jobDescription}</p>
            </li>
            {panel &&
                <div className="fixed top-0 left-0 w-full h-full cursor-default bg-black/40 flex justify-center items-center z-[100]" onClick={() => setPanel(false)}>
                    <div className="relative bg-white w-[500px] p-[15px] rounded-[10px] shadow-[0_4px_20px_rgba(0,0,0,0.2) cursor-default" onClick={(e) => e.stopPropagation()}>
                        {Object.entries(applicationData).map(([k, v]) =>
                            v ? <p>
                                <span>{k}</span> : <span>{v}</span>
                            </p> : ""
                        )}
                        <div className="flex justify-evenly">
                            <Link to={`/update`} state={{ p }}>update</Link>
                            <button onClick={() => setDeletePanel(true)}>delete</button>
                            {deletePanel &&
                                <div
                                    ref={deletePanelRef}
                                    tabIndex={-1}
                                    role="dialog"
                                    aria-modal="true"
                                    className="absolute top-[40%] left-[25%] z-[500] border rounded-[4px] bg-white p-[10px] cursor-default"
                                >
                                    <p>are you sure you want to delete this</p>
                                    <div className="flex justify-evenly">
                                        <button onClick={deleteApplication}>delete</button>
                                        <button onClick={() => setDeletePanel(false)}>cancel</button>
                                    </div>
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

export default Application