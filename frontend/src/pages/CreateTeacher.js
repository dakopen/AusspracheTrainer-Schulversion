import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";

function CreateTeacher() {
	const [email, setEmail] = useState("");
	const { authTokens } = useContext(AuthContext);
	const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const url = `${ACCOUNT_BASE_URL}/create-teacher`;
		const data = JSON.stringify({ username: email });

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

				},
				body: data,
			});

			if (response.status === 201) {
				alert(
					"User created successfully. A link has been sent to their email to set a password."
				);
			} else {
				const responseData = await response.json();
				throw new Error(
					responseData.detail ||
						"An error occurred while creating the user."
				);
			}
		} catch (error) {
			alert(error.message);
			console.error(error);
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<label>
				Email:
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</label>
			<button type="submit">Create User</button>
		</form>
	);
}

export default CreateTeacher;
