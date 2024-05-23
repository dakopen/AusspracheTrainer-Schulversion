import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { UrlContext } from "../../context/UrlContext";
import './RequestPasswordReset.css';

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
                addNotification("Der Link zum Zurücksetzen des Passworts wurde an Ihre E-Mail gesendet.", "success");
                navigate("/login"); // Redirect to login page or a confirmation page
            } else {
                const errorData = await response.json(); // Assuming the server sends back JSON
                addNotification(errorData.error, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            addNotification("E-Mail zum Zurücksetzen konnte nicht gesendet werden. Bitte versuchen Sie es erneut.", "error");
        }
    };

    return (
        <div className="reset-password-form">
            <h1>Passwort zurücksetzen (nur für Lehrer:innen)</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Gib deine E-Mail-Adresse ein, um einen Link zum Zurücksetzen des Passworts zu erhalten:
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Link zum Zurücksetzen versenden</button>
            </form>

            <p>Falls du den Benutzernamen für deinen <b>Schüleraccount</b> vergessen hast, kannst du ihn dir <Link to="/forgot-username">hier</Link> an deine Mail Adresse senden.</p>
        </div>
    );

}

export default RequestPasswordReset;
