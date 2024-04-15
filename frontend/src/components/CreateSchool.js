import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { fetchCourses } from "../utils/api";

const CreateSchool = ({ setCourses }) => {
	const [name, setName] = useState("");
	const [address, setAddress] = useState("");
	const [shortId, setShortId] = useState("");
	const [englishSinceGrade, setEnglishSinceGrade] = useState(5);
	const [frenchSinceGrade, setFrenchSinceGrade] = useState(6);
	const { authTokens } = useContext(AuthContext);
	const { ACCOUNT_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const url = `${ACCOUNT_BASE_URL}/schools/create`;
		const data = JSON.stringify({
			name,
			address,
			short_id: shortId,
			english_since_grade: englishSinceGrade,
			french_since_grade: frenchSinceGrade,
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
			<label>
				Seit welche Stufe bietet die Schule Englisch an:
				<select
					value={englishSinceGrade}
					onChange={(e) => setEnglishSinceGrade(e.target.value)}
					required
				>
					<option value={5}>5. Klasse</option>
					<option value={6}>6. Klasse</option>
					<option value={7}>7. Klasse</option>
					<option value={8}>8. Klasse</option>
					<option value={9}>9. Klasse</option>
					<option value={10}>10. Klasse</option>
					<option value={11}>11. Klasse</option>
					<option value={12}>12. Klasse</option>
					<option value={13}>13. Klasse</option>
				</select>
			</label>
			<label>
				Seit welche Stufe bietet die Schule Französisch an:
				<select
					value={frenchSinceGrade}
					onChange={(e) => setFrenchSinceGrade(e.target.value)}
					required
				>
					<option value={5}>5. Klasse</option>
					<option value={6}>6. Klasse</option>
					<option value={7}>7. Klasse</option>
					<option value={8}>8. Klasse</option>
					<option value={9}>9. Klasse</option>
					<option value={10}>10. Klasse</option>
					<option value={11}>11. Klasse</option>
					<option value={12}>12. Klasse</option>
					<option value={13}>13. Klasse</option>
				</select>
			</label>
			<button type="submit">Create School</button>
		</form>
	);
};

export default CreateSchool;
