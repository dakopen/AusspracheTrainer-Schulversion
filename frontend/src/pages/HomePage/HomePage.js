import React, { useState, useContext } from "react";
import { useNotification } from "../../context/NotificationContext";
import { isStudyStudent } from "../../utils/RoleChecks";
import ToDo from "../../components/ToDo/ToDo";
import AuthContext from "../../context/AuthContext";

import Textarea from "../../components/Textarea";
import SpeechSynthesis from "../../components/SpeechSynthesis";
import RecordingButton from "../../components/RecordingButton";
import AudioVisualizer from "../../components/AudioVisualizer";
import { AudioRecordingProvider } from "../../context/AudioRecordingContext";

import { triggerAnalysis } from "../../utils/api";

const HomePage = () => {
	const { addNotification } = useNotification();
	const { user, authTokens } = useContext(AuthContext);
	const [recordingState, setRecordingState] = useState(0);

	return (
		<div className="App">
			<h1>AusspracheTrainer Studie</h1>
			{isStudyStudent(user) && <ToDo />}
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
