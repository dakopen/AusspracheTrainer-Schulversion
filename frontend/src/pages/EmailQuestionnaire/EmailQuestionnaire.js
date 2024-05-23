import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { UrlContext } from "../../context/UrlContext";
import { useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import './EmailQuestionnaire.css';

const EmailQuestionnaire = () => {
	const [email, setEmail] = useState("");
	const [confirmEmail, setConfirmEmail] = useState("");
	let { authTokens } = useContext(AuthContext);
	const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);
	const navigate = useNavigate();
	const { addNotification } = useNotification();

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (email !== confirmEmail) {
			alert("Die E-Mails stimmen nicht überein.");
			return;
		}

		const url = `${ACCOUNT_BASE_URL}/submit-studystudent-email/`;
		const data = JSON.stringify({ email });

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authTokens.access}`,
					"ngrok-skip-browser-warning": "true",

				},
				body: data,
			});

			if (response.status === 201) {
				addNotification(
					"E-Mail-Adresse erfolgreich gesetzt.",
					"success"
				);

				navigate("/");
			} else {
				throw new Error(
					"Beim Einreichen der E-Mail ist ein Fehler aufgetreten."
				);
			}
		} catch (error) {
			alert(error.message);
		}
	};

	return (
		<>
			<p className="email-notification">
				Diese E-Mail-Adresse wird für wichtige Benachrichtigungen und
				das Zurücksetzen des Benutzernamens verwendet. Du kannst eine eigene
				oder die Mail Adresse deiner Eltern angeben.

				Falls möglich, nutze eine E-Mail-Adresse, die keine persönlichen
				Informationen (wie den Namen) enthält.
			</p>
			<form onSubmit={handleSubmit} className="email-form">
				<label className="email-input">
					E-Mail-Adresse:

					<input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						required
					/>
				</label>
				<label className="email-input">
					E-Mail-Adresse wiederholen:

					<input
						type="email"
						value={confirmEmail}
						onChange={(e) => setConfirmEmail(e.target.value)}
						required
					/>
				</label>
				<button type="submit" className="confirm-button">bestätigen</button>
			</form>
		</>


	);
};

export default EmailQuestionnaire;
