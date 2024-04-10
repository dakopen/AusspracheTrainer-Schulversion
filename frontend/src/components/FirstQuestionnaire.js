import React, { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";

const FirstQuestionnaire = () => {
	const [age, setAge] = useState("");
	const [sex, setSex] = useState("");
	const [pronunciationSkill, setPronunciationSkill] = useState(5);
	const [weeklyLanguageContactHours, setWeeklyLanguageContactHours] =
		useState("");
	let { authTokens, user } = useContext(AuthContext);

	const { STUDYDATA_BASE_URL } = useContext(UrlContext);

	const handleSubmit = async (event) => {
		event.preventDefault();
		const url = `${STUDYDATA_BASE_URL}/submit-first-questionnaire/`;
		const data = JSON.stringify({
			age,
			sex,
			pronunciation_skill: pronunciationSkill,
			weekly_language_contact_hours: weeklyLanguageContactHours,
		});

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authTokens.access}`,
				},
				body: data,
			});

			if (response.status === 201) {
				alert("Questionnaire submitted successfully.");
				// Optionally reset form fields
				setAge("");
				setSex("");
				setPronunciationSkill("");
				setWeeklyLanguageContactHours("");
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
				Age:
				<input
					type="number"
					value={age}
					onChange={(e) => setAge(e.target.value)}
					required
					min="1"
					max="99"
				/>
			</label>
			<label>
				Geschlecht:
				<select
					value={sex}
					onChange={(e) => setSex(e.target.value)}
					required
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
					value={pronunciationSkill}
					onChange={(e) => setPronunciationSkill(e.target.value)}
					required
					min="1"
					max="10"
				/>
			</label>
			<label>
				Wöchentliche Stunden Kontakt (Serie, Podcast, Musik, Gespräche,
				etc.) mit {user.language}:
				<input
					type="number"
					value={weeklyLanguageContactHours}
					onChange={(e) =>
						setWeeklyLanguageContactHours(e.target.value)
					}
					required
					min="0"
				/>
			</label>
			<button type="submit">Fragebogen abschicken</button>
		</form>
	);
};

export default FirstQuestionnaire;
