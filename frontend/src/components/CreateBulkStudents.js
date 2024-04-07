import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";

const CreateBulkStudents = () => {
	const { courseId } = useParams();
	const [numberOfStudents, setNumberOfStudents] = useState(10); // Default to 10 students
	const { authTokens } = useContext(AuthContext);
	const { ACCOUNT_BASE_URL } = useContext(UrlContext);
	const { addNotification } = useNotification();

	const handleSubmit = async (event) => {
		event.preventDefault();
		const url = `${ACCOUNT_BASE_URL}/courses/${courseId}/students/bulkcreate`; // Adjust as per your actual API endpoint

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${String(authTokens.access)}`,
				},
				body: JSON.stringify({ number_of_students: numberOfStudents }),
			});

			if (!response.ok) {
				addNotification("Failed to create students.", "error");
				throw new Error("Failed to create students");
			}

			const data = await response.json();
			addNotification(data.message, "success");
			// Optionally reset the form or redirect the user
			setNumberOfStudents(10); // Reset to default or consider redirecting
		} catch (error) {
			addNotification("Failed to create students.", "error");
			console.error("Error creating students:", error.message);
		}
	};

	return (
		<div>
			<h3>Create Bulk Students for Course</h3>
			<form onSubmit={handleSubmit}>
				<label>
					Number of Students:
					<input
						type="number"
						value={numberOfStudents}
						onChange={(e) => setNumberOfStudents(e.target.value)}
						min="1"
						required
					/>
				</label>
				<button type="submit">Create Students</button>
			</form>
		</div>
	);
};

export default CreateBulkStudents;
