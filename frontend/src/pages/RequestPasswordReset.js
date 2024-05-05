import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { UrlContext } from "../context/UrlContext";

function RequestPasswordReset() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${ACCOUNT_BASE_URL}/request-reset-password/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                addNotification("Password reset link has been sent to your email.", "success");
                navigate("/login"); // Redirect to login page or a confirmation page
            } else {
                const errorData = await response.json(); // Assuming the server sends back JSON
                addNotification(errorData.error, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            addNotification("Failed to send reset email. Please try again.", "error");
        }
    };

    return (
        <div>
            <h1>Request Password Reset</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Enter your email:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Send Reset Link</button>
            </form>
        </div>
    );
}

export default RequestPasswordReset;
