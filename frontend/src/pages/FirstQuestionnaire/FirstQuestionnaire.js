import React, { useState, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { UrlContext } from "../../context/UrlContext";
import { useNotification } from "../../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import './FirstQuestionnaire.css';


const FirstQuestionnaire = () => {
	const [age, setAge] = useState(null);
	const [sex, setSex] = useState(null);
	const [pronunciationSkill, setPronunciationSkill] = useState(null);
	const [weeklyLanguageContactHours, setWeeklyLanguageContactHours] =
		useState(null);
	let { authTokens, user } = useContext(AuthContext);
	const { addNotification } = useNotification();
	const navigate = useNavigate();

	const { BASE_URL, STUDYDATA_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (event) => {
		event.preventDefault();

		// Check if all fields are null and prompt for confirmation if they are
		if (
			!age &&
			!sex &&
			!pronunciationSkill &&
			!weeklyLanguageContactHours
		) {
			const isConfirmed = window.confirm(
				"Du hast keine Angaben gemacht. Möchtest du dennoch fortfahren?"
			);
			if (!isConfirmed) {
				return; // Early return if the user cancels
			}
		}

		const payload = {
			age: age ? parseInt(age) : null,
			sex: sex || null,
			pronunciation_skill: pronunciationSkill || null,
			weekly_language_contact_hours: weeklyLanguageContactHours
				? parseInt(weeklyLanguageContactHours)
				: null,
		};

		const data = JSON.stringify(payload);

		try {
			const response = await fetch(
				`${STUDYDATA_BASE_URL}/submit-first-questionnaire/`,
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
				setAge(null);
				setSex(null);
				setPronunciationSkill(null);
				setWeeklyLanguageContactHours(null);
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

				Diese Daten helfen uns, Verbesserungen in der Aussprache über verschiedene Altersgruppen und Sprachvertrautheitsstufen hinweg nachzuvollziehen.
				Alle Angaben sind freiwillig und die Antworten werden nicht mit der/dem Lehrer:in geteilt.
			</p>
			<form onSubmit={handleSubmit} className="form-container">

				<label className="form-input">
					Alter:
					<input
						type="number"
						value={age || ""}
						onChange={(e) => setAge(e.target.value)}
						min="1"
						max="99"
					/>
				</label>
				<label className="form-input">
					Geschlecht:
					<select
						value={sex || ""}
						onChange={(e) => setSex(e.target.value)}
					>
						<option value="">Auswählen</option>
						<option value="m">männlich</option>
						<option value="w">weiblich</option>
						<option value="d">divers</option>
					</select>
				</label>
				<label className="form-input range-input">
					Selbsteinschätzung der eigenen {user.language === 1 ? "englischen" : "französischen"} Aussprache:
					<div className="range-labels">
						<span>nicht so gut</span>
						<span>hervorragend</span>
					</div>
					<input
						type="range"
						value={pronunciationSkill || 5}
						onChange={(e) => setPronunciationSkill(e.target.value)}
						min="1"
						max="10"
					/>
				</label>
				<label className="form-input">
					Wöchentliche Stunden Kontakt (Serie, Podcast, Musik, Gespräche, etc.) mit {user.language === 1 ? "Englisch" : "Französisch"}:
					<input
						type="number"
						value={weeklyLanguageContactHours || ""}
						onChange={(e) => setWeeklyLanguageContactHours(e.target.value)}
						min="0"
					/>
				</label>
				<button type="submit" className="submit-button">Fragebogen abschicken</button>
			</form>

		</>
	);
};

export default FirstQuestionnaire;
