import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UserProfile({ info }) {
    const [panel, setPanel] = useState(false)
    const [deleteAccount, setDeleteAccount] = useState(false);
    const navigate = useNavigate();
    const logout = async () => {
        localStorage.removeItem("userInfo");
        await fetch(`${import.meta.env.VITE_API_URL}/user/logout`, {
            method: "GET",
            credentials: "include"
        });
        navigate("/login");
    };

    const handleDeleteSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const email = formData.get("email");
        const password = formData.get("password");

        await fetch(`${import.meta.env.VITE_API_URL}/user/delete`, {
            method: "DELETE",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        localStorage.removeItem("userInfo");
        navigate("/login");
    };

    return (
        <div>
            <div onClick={() => setPanel(true)} className="border cursor-pointer rounded-[3px] p-1">
                {info.firstName} {info.lastName}
            </div>
            {panel && (
                <div className="fixed top-0 left-0 w-full h-full bg-black/40 flex justify-center items-center z-[1000]" onClick={() => setPanel(false)}>
                    <div className="bg-white min-w-100 p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]" onClick={(e) => e.stopPropagation()} >
                        <p>full name : {info.firstName} {info.lastName}</p>
                        <p>email : {info.email}</p>
                        <div className="flex justify-between mt-3">
                            <button onClick={logout}>logout</button>
                            <button onClick={() => setDeleteAccount(true)}>delete account</button>
                            <button onClick={() => setPanel(false)}>close</button>
                        </div>
                    </div>
                </div>
            )}

            {deleteAccount && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black/60 flex justify-center items-center z-[2000]"
                    onClick={() => setDeleteAccount(false)}
                >
                    <div
                        className="bg-white min-w-100 p-6 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <form onSubmit={handleDeleteSubmit} className="rounded-xl">
                            <h2 className="text-lg font-semibold mb-3">delete account</h2>
                            <span>Enter email</span><br />
                            <input type="email" name="email" required /><br />
                            <span>Enter password</span><br />
                            <input type="password" name="password" required /><br />
                            <div className="flex justify-between mt-3">
                                <button className="bg-red-500 text-white px-3 py-1 rounded-md" type="submit">
                                    delete account permanently
                                </button>
                                <button type="button" onClick={() => setDeleteAccount(false)}>
                                    cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserProfile;