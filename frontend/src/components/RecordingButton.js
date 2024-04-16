import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";

const AudioRecorder = () => {
	const [isRecording, setIsRecording] = useState(false);
	const [mediaRecorder, setMediaRecorder] = useState(null);
	const [audioType, setAudioType] = useState("");
	const { authTokens } = useContext(AuthContext);

	useEffect(() => {
		const options = determineAudioOptions();
		if (options) {
			setAudioType(options.type);
		}
	}, []);

	const determineAudioOptions = () => {
		const audioTypes = [
			"audio/ogg",
			"audio/wav",
			"audio/mp4",
			"audio/webm",
			"audio/mpeg",
		];
		for (let type of audioTypes) {
			if (MediaRecorder.isTypeSupported(type)) {
				console.log("Using audio type:", type);
				return { type: type };
			}
		}
		alert(
			"Dein Browser unterstützt keine Audioaufnahmen. Bitte verwende einen anderen Browser."
		);
		return null;
	};

	const toggleRecording = async () => {
		if (!audioType) return;

		if (!isRecording) {
			console.log("Starting recording...");
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
			});
			const recorder = new MediaRecorder(stream, { mimeType: audioType });
			let chunks = [];

			recorder.ondataavailable = (event) => {
				if (event.data.size > 0) {
					chunks.push(event.data);
				}
			};

			recorder.onstop = async () => {
				console.log("Recording stopped.");
				const blob = new Blob(chunks, { type: audioType });
				console.log("Blob:", blob);
				handleSubmit(blob);
				chunks = [];
				setIsRecording(false);
			};

			recorder.start(10); // Consider using recorder.start(1000) to collect chunks every second
			setMediaRecorder(recorder);
			setIsRecording(true);
		} else {
			console.log("Stopping recording...");
			mediaRecorder.stop();
			mediaRecorder.stream.getTracks().forEach((track) => track.stop());
		}
	};

	const handleSubmit = async (blob) => {
		const formData = new FormData();
		console.log("Submitting audio blob:", blob);
		formData.append("audio", blob);
		formData.append("audio_mimetype", audioType);
		formData.append("text", "Test Text");
		console.log("Submitting form data:", formData);
		try {
			const response = await fetch(
				"http://127.0.0.1:8000/studydata/audio-analysis/",
				{
					method: "POST",
					headers: {
						Authorization: "Bearer " + String(authTokens.access),
					},
					body: formData,
				}
			);
			const data = await response.json();
			console.log("Submission Successful:", data);
		} catch (error) {
			console.error("Error submitting form:", error);
		}
	};

	return (
		<div>
			<button onClick={toggleRecording}>
				{isRecording ? "Stop and Submit" : "Start Recording"}
			</button>
		</div>
	);
};

export default AudioRecorder;
