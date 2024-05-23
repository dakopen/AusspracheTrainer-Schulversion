import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { UrlContext } from "../../context/UrlContext";
import './ForgotUsername.css';

function ForgotUsername() {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(
                `${ACCOUNT_BASE_URL}/forgot-username/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ email }),
                }
            );

            if (response.ok) {
                addNotification("Your username has been sent to your email.", "success");
                navigate("/login"); // Redirect to the login page or a confirmation page
            } else {
                const errorData = await response.json(); // Assuming the server sends back JSON
                addNotification(errorData.error, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            addNotification("Keinen Benutzernamen (eines Schüler-Accounts) mit dieser Email Adresse gefunden.", "error");
        }
    };

    return (
        <div className="retrieve-username-form">
            <h1>Benutzername abrufen (nur für Schüler:innen)</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Gib deine registrierte E-Mail-Adresse ein:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Benutzername abrufen</button>
            </form>
        </div>
    );

}

export default ForgotUsername;
