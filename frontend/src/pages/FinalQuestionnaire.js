import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const FinalQuestionnaire = () => {
	const [motivation, setMotivation] = useState(null);
	const [feelingOfImprovement, setFeelingOfImprovement] = useState(null);
	const [weeklyTrainingMinutes, setweeklyTrainingMinutes] =
		useState(null);
	let { authTokens, user } = useContext(AuthContext);
	const { addNotification } = useNotification();
	const navigate = useNavigate();

	const { BASE_URL, STUDYDATA_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Check if all fields are null and prompt for confirmation if they are
		if (
			!motivation &&
			!feelingOfImprovement &&
			!weeklyTrainingMinutes
		) {
			const isConfirmed = window.confirm(
				"Du hast keine Angaben gemacht. Möchtest du dennoch fortfahren?"
			);
			if (!isConfirmed) {
				return; // Early return if the user cancels
			}
		}

		const payload = {
			motivation: motivation || null,
			feelingOfImprovement: feelingOfImprovement || null,
			weeklyTrainingMinutes: weeklyTrainingMinutes
				? parseInt(weeklyTrainingMinutes)
				: null,
		};

		const data = JSON.stringify(payload);

		try {
			const response = await fetch(
				`${STUDYDATA_BASE_URL}/submit-final-questionnaire/`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${authTokens.access}`,
						"ngrok-skip-browser-warning": "true",
					},
					body: data,
				}
			);

			if (response.status === 201) {
				addNotification(
					"Fragebogen erfolgreich eingereicht.",
					"success"
				);
				// Reset the form fields to null after successful submission
				setFeelingOfImprovement(null);
				setMotivation(null);
				setweeklyTrainingMinutes(null);
				navigate("/");
			} else {
				const responseData = await response.json();
				addNotification(
					responseData[0] ||
					"Beim Einreichen des Fragebogens ist ein Fehler aufgetreten.",
					"error"
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
				Wie viele Minuten hast du im Schnitt pro Woche deine Aussprache trainiert?:
				<input
					type="number"
					value={weeklyTrainingMinutes || ""}
					onChange={(e) => setweeklyTrainingMinutes(e.target.value)}
					min="1"
					max="1000"
				/>
			</label>

			<label>
				Wie glaubst du, haben sich deine Aussprachefähigkeiten verändert?
				<input
					type="range"
					value={feelingOfImprovement || 5}
					onChange={(e) => setFeelingOfImprovement(e.target.value)}
					min="1"
					max="10"
				/>
			</label>
			<label>
				Wie motiviert warst du, deine Aussprache zu verbessern?
				<input
					type="range"
					value={motivation || 5}
					onChange={(e) => setMotivation(e.target.value)}
					min="1"
					max="10"
				/>
			</label>
			<button type="submit">Fragebogen abschicken</button>
		</form>
	);
};

export default FinalQuestionnaire;
