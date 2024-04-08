import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

function CreateTeacher() {
	const [email, setEmail] = useState("");
	const { authTokens } = useContext(AuthContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const url = "http://127.0.0.1:8000/accounts/create-teacher";
		const data = JSON.stringify({ username: email });

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
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
