import React, { useState, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";

const CreateBulkStudents = ({ refreshStudents }) => {
	const { courseId } = useParams();
	const [numberOfStudents, setNumberOfStudents] = useState(10); // Default to 10 students
	const { authTokens } = useContext(AuthContext);
	const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);
	const { addNotification } = useNotification();
	const [creating, setCreating] = useState(false);

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (creating) return;
		const url = `${ACCOUNT_BASE_URL}/courses/${courseId}/students/bulkcreate`; // Adjust as per your actual API endpoint
		setCreating(true);
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
				addNotification("Die Erstellung von Schülern ist fehlgeschlagen.", "error");
				throw new Error("Schüler konnten nicht angelegt werden.");
			}

			const data = await response.json();
			addNotification(data.message, "success");
			// reset the form to default
			setNumberOfStudents(10);

			refreshStudents(); // Trigger the refresh
			setCreating(false);
		} catch (error) {
			addNotification("Die Erstellung von Schülern ist fehlgeschlagen.", "error");
			console.error("Fehler beim Anlegen von Schülern:", error.message);
			setCreating(false);
		}
	};

	return (
		<div className="bulk-students-container">
			<h4 className="bulk-students-header">Schüler:innen Accounts für diesen Kurs erstellen</h4>
			<form onSubmit={handleSubmit} className="bulk-students-form">
				<label>
					Anzahl:
					<input
						type="number"
						className="bulk-students-input"
						value={numberOfStudents}
						onChange={(e) => setNumberOfStudents(e.target.value)}
						min="1"
						required
					/>
				</label>
				<button type="submit" className="bulk-students-button">{creating ? "Lädt... (dauert kurz)" : "Schüleraccounts erstellen"}</button>
			</form>
		</div>
	);
};

export default CreateBulkStudents;
