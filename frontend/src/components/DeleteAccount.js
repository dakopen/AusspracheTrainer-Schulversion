import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";

const DeleteAccount = () => {
    const { authTokens } = useContext(AuthContext);
    const { ACCOUNT_BASE_URL } = useContext(UrlContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDeleteAccount = async () => {
        setLoading(true);
        const url = `${ACCOUNT_BASE_URL}/delete-account/`;

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
                setMessage("A confirmation link has been sent to your email. Please check your email to confirm account deletion.");
            } else {
                throw new Error(data.detail || "An error occurred while requesting account deletion.");
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
            <h1>Delete Account</h1>
            <p>Please confirm that you want to permanently delete your account. An email will be sent to your registered email address with further instructions.</p>
            {message && <p>{message}</p>}
            <button onClick={handleDeleteAccount} disabled={loading}>
                {loading ? "Processing..." : "Delete My Account"}
            </button>
        </div>
    );
};

export default DeleteAccount;
