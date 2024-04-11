import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const FirstQuestionnaire = () => {
	const [age, setAge] = useState(null);
	const [sex, setSex] = useState(null);
	const [pronunciationSkill, setPronunciationSkill] = useState(null);
	const [weeklyLanguageContactHours, setWeeklyLanguageContactHours] =
		useState(null);
	let { authTokens, user } = useContext(AuthContext);
	const { addNotification } = useNotification();
	const navigate = useNavigate();

	const { STUDYDATA_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (event) => {
		event.preventDefault();

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
					},
					body: data,
				}
			);

			if (response.status === 201) {
				addNotification(
					"Questionnaire submitted successfully.",
					"success"
				);
				setAge(null);
				setSex(null);
				setPronunciationSkill(null);
				setWeeklyLanguageContactHours(null);
				navigate("/");
			} else {
				const responseData = await response.json();
				throw new Error(
					responseData.detail ||
						"An error occurred while submitting the questionnaire."
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
				Alter:
				<input
					type="number"
					value={age || ""}
					onChange={(e) => setAge(e.target.value)}
					min="1"
					max="99"
				/>
			</label>
			<label>
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
			<label>
				Selbsteinschätzung der eigenen Aussprache (1-10) in{" "}
				{user.language}:
				<input
					type="range"
					value={pronunciationSkill || 5}
					onChange={(e) => setPronunciationSkill(e.target.value)}
					min="1"
					max="10"
				/>
			</label>
			<label>
				Wöchentliche Stunden Kontakt (Serie, Podcast, Musik, Gespräche,
				etc.) mit {user.language}:
				<input
					type="number"
					value={weeklyLanguageContactHours || ""}
					onChange={(e) =>
						setWeeklyLanguageContactHours(e.target.value)
					}
					min="0"
				/>
			</label>
			<button type="submit">Fragebogen abschicken</button>
		</form>
	);
};

export default FirstQuestionnaire;
