import React, { useState, useContext } from "react";
import { useNotification } from "../context/NotificationContext";
import { isStudyStudent } from "../utils/RoleChecks";
import ToDo from "../components/ToDo";
import AuthContext from "../context/AuthContext";

import Textarea from "../components/Textarea";
import SpeechSynthesis from "../components/SpeechSynthesis";
import RecordingButton from "../components/RecordingButton";
import AudioVisualizer from "../components/AudioVisualizer";
import { AudioRecordingProvider } from "../context/AudioRecordingContext";

import { triggerAnalysis } from "../utils/api";

const HomePage = () => {
	const { addNotification } = useNotification();
	const { user, authTokens } = useContext(AuthContext);
	const [recordingState, setRecordingState] = useState(0);

	return (
		<div className="App">
			<p>Homepage</p>
			<button
				onClick={() =>
					addNotification("Error! Something went wrong.", "error")
				}
			>
				Show Error
			</button>
			{isStudyStudent(user) && <ToDo />}
			{/*<Textarea textareaValue="This is a text area" />*/}
			<br></br>
			<Textarea textareaValue="This is another text area but with text so long that it wraps into multiple lines letting me test advanced things." />
			<br></br>
			<AudioRecordingProvider>
				<RecordingButton setRecordingState={setRecordingState} />
				<br></br>
				<AudioVisualizer recordingState={recordingState} />
			</AudioRecordingProvider>
			<SpeechSynthesis
				audioUrl={
					"https://www.fluentu.com/blog/english/wp-content/uploads/sites/4/2024/02/v1-7c88f6eaf460a5f05b3bc7e21ccc5e2c-neural-Salli.mp3"
				}
			/>
			<button
				onClick={() => {
					triggerAnalysis(authTokens);
				}}
			>TRIGGER ANALYSIS</button>
		</div>
	);
};

export default HomePage;
