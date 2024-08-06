import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { UrlContext } from "../../context/UrlContext";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import './FinalQuestionnaire.css';
import { triggerAnalysis } from "../../utils/api";

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
		// triggers re-analysis of the test-sentences if the user submits the final questionnaire
		triggerAnalysis(authTokens);

		const payload = {
			motivation: motivation || null,
			feeling_of_improvement: feelingOfImprovement || null,
			weekly_training_in_minutes: weeklyTrainingMinutes
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
		<>
			<p className="data-notification">
				Dies ist der finale Fragebogen. Alle angaben sind weiterhin freiwillig, helfen uns aber, die Effekte des Aussprachetrainings besser zu verstehen. Vielen Dank für deine Teilnahme!
			</p>
			<form onSubmit={handleSubmit} className="final-questionnaire-form-container">
				<label className="final-questionnaire-form-input">
					Wie viele Minuten hast du im Schnitt pro Woche deine Aussprache trainiert?:
					<input
						type="number"
						value={weeklyTrainingMinutes || ""}
						onChange={(e) => setweeklyTrainingMinutes(e.target.value)}
						min="1"
						max="1000"
					/>
				</label>

				<div className="final-questionnaire-form-input range-input">
					<label>
						Wie glaubst du, haben sich deine Aussprachefähigkeiten verändert?
						<div className="range-labels">
							<span>gar nicht verbessert</span>
							<span>stark verbessert</span>
						</div>
						<input
							type="range"
							value={feelingOfImprovement || 5}
							onChange={(e) => setFeelingOfImprovement(e.target.value)}
							min="1"
							max="10"
						/>

					</label>
				</div>

				<div className="final-questionnaire-form-input range-input">
					<label>
						Wie motiviert warst du, deine Aussprache zu verbessern?
						<div className="range-labels">
							<span>wenig motiviert</span>
							<span>sehr motiviert</span>
						</div>
						<input
							type="range"
							value={motivation || 5}
							onChange={(e) => setMotivation(e.target.value)}
							min="1"
							max="10"
						/>
					</label>
				</div>

				<button type="submit" className="submit-button">Fragebogen abschicken</button>
			</form>
		</>
	);
};

export default FinalQuestionnaire;
