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
    const { ACCOUNT_BASE_URL } = useContext(UrlContext);
    const { logoutUser } = useContext(AuthContext);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setIsDeleting(true);

        try {
            const response = await fetch(
                `${ACCOUNT_BASE_URL}/delete-account/confirm/${uidb64}/${token}/`, // Updated to use path parameters
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    }
                }
            );

            if (response.ok) {
                alert("Your account has been successfully deleted.");
                logoutUser();
                navigate("/"); // Redirect to home or any other page
            } else {
                const errorData = await response.json();
                console.log("Response:", errorData);
                addNotification(errorData.error, "error");
            }
        } catch (error) {
            console.error("Error:", error);
            addNotification("Failed to delete account due to a network error", "error");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h1>Delete Your Account</h1>
            <p>Are you sure you want to delete your account? This action cannot be undone.</p>
            <button type="submit" disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete My Account"}
            </button>
        </form>
    );
}

export default DeleteAccountConfirm;
