import React, { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";

const ChangeUsername = () => {
    const { authTokens } = useContext(AuthContext);
    const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChangeUsername = async () => {
        const confirmed = window.confirm("Bist du sicher, dass du deinen Benutzernamen ändern möchtest? Diese Aktion kann nicht rückgängig gemacht werden.");
        if (!confirmed) {
            return; // Frühes Beenden, wenn nicht bestätigt
        }

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
                setMessage(`${data.message}`);
            } else {
                throw new Error(data.detail || "Ein Fehler ist aufgetreten (wahrscheinlich ungültige Mail Adresse).");
            }
        } catch (error) {
            setMessage("Ein Fehler ist aufgetreten (wahrscheinlich ungültige Mail Adresse).");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <p style={{ textAlign: "justify" }}>Wenn jemand unbefugtes deinen Benutzernamen (= dein Passwort) mitbekommen hat, kannst deinen Benutzernamen hier automatisch ändern und an deine hinterlegte Mail Adresse senden. Falls du keinen Zugriff mehr auf deine Mail Adresse hast, wende dich an dein:e Lehrer:in, um den neuen Benutzernamen zu erhalten (sag ihr/ihm, er erscheint im Kurs-Overview).</p>
            {message && <p>{message}</p>}
            <button onClick={handleChangeUsername} disabled={loading}>
                {loading ? "Wird geändert..." : "Benutzernamen ändern und per Mail erhalten"}
            </button>
        </div>
    );
};

export default ChangeUsername;
