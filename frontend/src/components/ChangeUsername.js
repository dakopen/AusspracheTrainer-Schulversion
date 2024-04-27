import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";

const ChangeUsername = () => {
    const { authTokens } = useContext(AuthContext);
    const { ACCOUNT_BASE_URL } = useContext(UrlContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChangeUsername = async () => {
        setLoading(true);
        const url = `${ACCOUNT_BASE_URL}/change-username/`;
        
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${authTokens.access}`,
                },
            });

            const data = await response.json();
            if (response.ok) {
                setMessage(`Your username has been updated to: ${data.message}`);
            } else {
                throw new Error(data.detail || "An error occurred while updating your username.");
            }
        } catch (error) {
            setMessage(error.message);
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Change Username</h1>
            <p>You can request a new username which will be automatically generated. A confirmation with the new username will be sent to your registered email.</p>
            {message && <p>{message}</p>}
            <button onClick={handleChangeUsername} disabled={loading}>
                {loading ? "Updating..." : "Change My Username"}
            </button>
        </div>
    );
};

export default ChangeUsername;
