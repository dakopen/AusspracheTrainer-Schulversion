import React, { useState, useContext } from "react";
import { useNotification } from "../../context/NotificationContext";
import { isStudyStudent, isTeacher } from "../../utils/RoleChecks";
import ToDo from "../../components/ToDo/ToDo";
import AuthContext from "../../context/AuthContext";

import Textarea from "../../components/Textarea";
import SpeechSynthesis from "../../components/SpeechSynthesis";
import RecordingButton from "../../components/RecordingButton";
import AudioVisualizer from "../../components/AudioVisualizer";
import { AudioRecordingProvider } from "../../context/AudioRecordingContext";
import { Link } from "react-router-dom";

import { triggerAnalysis } from "../../utils/api";

import './TeacherHomePage.css';

const HomePage = () => {
	const { addNotification } = useNotification();
	const { user, authTokens } = useContext(AuthContext);
	const [recordingState, setRecordingState] = useState(0);

	return (
		<div className="App">
			<h1>AusspracheTrainer Studie</h1>
			{isStudyStudent(user) && <ToDo />}
			{isTeacher(user) &&
				<>
					<div className="teacher-homepage-container">
						<Link to="/courses" className="card-link">
							<div className="homepage-card">
								<h3>Kurse</h3>
								<p>Erstellen und verwalten Sie Ihre Kurse.</p>
							</div>
						</Link>

						<div className="homepage-card">

							<h3>Downloads</h3>
							<p>Hier kommen Links zu den Dokumenten wie Einverständniserklärung und Teilnehmeraufklärung hin.</p>
						</div>
						<div className="homepage-card">
							<h3>Kontakt</h3>
							<p>Bei Fragen, Anregungen, technischen Problemen und sonstigen Anliegen schreiben
								Sie mir bitte eine Mail an <a href="mailto:daniel.roland.busch@gmail.com">daniel.roland.busch@gmail.com</a>.
								<br></br>
								<br></br>
								<small>(Eine Mail an kontakt@aussprachetrainer.org ist auch in Ordnung, allerdings kann es sein, dass ich da länger brauche, um zu antworten.)</small>
							</p>
						</div>
					</div>

				</>



			}
			<br></br>
			<br></br>
			<button
				onClick={() => {
					triggerAnalysis(authTokens);
				}}
			>TRIGGER ANALYSIS</button>
		</div>
	);
};

export default HomePage;
