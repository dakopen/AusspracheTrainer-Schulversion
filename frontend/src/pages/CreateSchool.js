import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";

const CreateSchool = () => {
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [shortId, setShortId] = useState("");
	const { authTokens } = useContext(AuthContext);
	const { API_BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const url = `${ACCOUNT_BASE_URL}/schools/create/`; // Adjust this URL to your actual endpoint
		const data = JSON.stringify({
			name,
			address,
			short_id: shortId,
		});

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
				alert("School created successfully.");
				// Optionally reset form fields
				setName("");
				setAddress("");
				setShortId("");
			} else {
				const responseData = await response.json();
				throw new Error(
					responseData.detail ||
						"An error occurred while creating the school."
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
				Name:
				<input
					type="text"
					value={name}
					onChange={(e) => setName(e.target.value)}
					required
				/>
			</label>
			<label>
				Address:
				<textarea
					value={address}
					onChange={(e) => setAddress(e.target.value)}
					required
				/>
			</label>
			<label>
				Short ID:
				<input
					type="text"
					value={shortId}
					onChange={(e) => setShortId(e.target.value)}
					required
					pattern="^[A-Z]+$"
					title="Short ID must be uppercase letters only"
				/>
			</label>
			<button type="submit">Create School</button>
		</form>
	);
};

export default CreateSchool;
