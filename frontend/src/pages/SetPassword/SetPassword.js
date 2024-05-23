import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useNotification } from "../../context/NotificationContext";
import { UrlContext } from "../../context/UrlContext";
import './SetPassword.css';


function SetPassword() {
	const [password, setPassword] = useState("");
	const location = useLocation();
	const navigate = useNavigate();
	const { addNotification } = useNotification();
	const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (e) => {
		e.preventDefault();

		const params = new URLSearchParams(location.search);
		const token = params.get("token");
		const uid = params.get("uid");

		try {
			const response = await fetch(
				`${ACCOUNT_BASE_URL}/set-password/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						"ngrok-skip-browser-warning": "true",

					},
					body: JSON.stringify({ uid, token, password }),
				}
			);

			if (response.ok) {
				// Check if status code is in the range 200-299
				alert("Password has been set successfully.");
				navigate("/rolelogin");
			} else {
				const errorData = await response.json(); // Assuming the server sends back JSON
				console.log("Response:", errorData);

				addNotification(errorData.error, "error");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	};

	return (
		<form className="reset-password-form" onSubmit={handleSubmit}>
			<label>
				Neues Passwort:
				<input
					type="password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
			</label>
			<button type="submit">Passwort festlegen</button>
		</form>
	);
	
}

export default SetPassword;
