import React, { useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
import { UrlContext } from "../context/UrlContext";
import AuthContext from "../context/AuthContext";

function DeleteAccountConfirm() {
    const [isDeleting, setIsDeleting] = useState(false);
    const { uidb64, token } = useParams(); // Using useParams to extract parameters from the URL path
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);
    const { logoutUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsDeleting(true);

        try {
            const response = await fetch(
                `${ACCOUNT_BASE_URL}/delete-account/confirm/${uidb64}/${token}/`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.ok) {
                alert("Dein Konto wurde erfolgreich gelöscht.");
                logoutUser();
                navigate("/");
            } else {
                const errorData = await response.json();
                addNotification(errorData.error, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            addNotification("Konto konnte aufgrund eines Netzwerkfehlers nicht gelöscht werden.", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Account löschen</h1>
            <p>Bist du sicher, dass du dein Konto löschen willst? Diese Aktion kann nicht rückgängig gemacht werden.</p>
            <button type="submit" disabled={isDeleting}>
                {isDeleting ? "Löschen..." : "Mein Konto löschen und alle Studiendaten unwiderruflich löschen"}
            </button>
        </form>
    );
}

export default DeleteAccountConfirm;
