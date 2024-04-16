import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { fetchCourses } from "../utils/api";

const CreateCourse = ({ setCourses }) => {
	const [name, setName] = useState("");
	const [language, setLanguage] = useState(1); // Default to English
	const [grade, setGrade] = useState(5); // Default to 5th grade

	const { authTokens } = useContext(AuthContext);
	const { ACCOUNT_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const url = `${ACCOUNT_BASE_URL}/courses/create`;
		const data = JSON.stringify({
			name,
			language,
			grade,
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
				alert("Course created successfully.");
				// Optionally reset form fields
				setName("");
				setLanguage(1); // Reset to default language

				// refetch courses
				const fetchedCourses = await fetchCourses(authTokens);
				setCourses(fetchedCourses);
			} else {
				const responseData = await response.json();
				console.log(responseData);
				throw new Error(
					responseData.detail ||
						"An error occurred while creating the course."
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
				Language:
				<select
					value={language}
					onChange={(e) => setLanguage(e.target.value)}
					required
				>
					<option value={1}>Englisch</option>
					<option value={2}>Französisch</option>
				</select>
			</label>
			<label>
				Stufe:
				<select
					value={language}
					onChange={(e) => setGrade(e.target.value)}
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
			<button type="submit">Create Course</button>
		</form>
	);
};

export default CreateCourse;