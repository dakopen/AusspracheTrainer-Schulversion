import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";

const DeleteAccount = () => {
    const { authTokens } = useContext(AuthContext);
    const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleDeleteAccount = async () => {
        const confirmed = window.confirm("Bist du sicher, dass du deinen Konto löschen möchtest? Nach Bestätigung der Löschungsmail wird dein Konto unwiderruflich gelöscht.");
        if (!confirmed) {
            return; // Frühes Beenden, wenn nicht bestätigt
        }

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
                setMessage("Ein Bestätigungslink wurde an deine E-Mail gesendet. Bitte bestätige die Löschung deines Kontos in deiner E-Mail.");
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
            <p style={{ textAlign: "justify" }}>Bitte bestätige, dass du dein Konto endgültig löschen möchtest. Eine E-Mail mit weiteren Anweisungen wird an deine registrierte E-Mail-Adresse gesendet. Wenn du keinen Zugriff mehr auf deine hinterlegte Mail Adresse hast, melde dich bei Daniel Busch (kontakt@aussprachetrainer.org).</p>
            {message && <p>{message}</p>}
            <button onClick={handleDeleteAccount} disabled={loading}>
                {loading ? "Verarbeiten..." : "Mein Konto löschen"}
            </button>
        </div>
    );
};

export default DeleteAccount;
