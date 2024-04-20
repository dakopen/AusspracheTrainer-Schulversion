import React, { createContext, useContext, useState, useEffect } from 'react';
import AuthContext from "../context/AuthContext";

const AudioRecordingContext = createContext();

export const useAudioRecording = () => useContext(AudioRecordingContext);

export const AudioRecordingProvider = ({ children }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [mediaRecorder, setMediaRecorder] = useState(null);
    const [audioType, setAudioType] = useState('');
    const [recordingState, setRecordingState] = useState(0); // 0: idle, 1: recording, 2: submitted
    const { authTokens } = useContext(AuthContext);

    let audioContext = new AudioContext();
    let analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;

    useEffect(() => {
        determineAudioOptions();

    }, []);



    const determineAudioOptions = () => {
        const audioTypes = ["audio/ogg", "audio/wav", "audio/mp4", "audio/webm", "audio/mpeg"];
        for (let type of audioTypes) {
            if (MediaRecorder.isTypeSupported(type)) {
                setAudioType(type);
                return;
            }
        }
        alert("Your browser does not support any of the required audio formats. Please use a different browser.");
    };

    const startRecording = async () => {
        if (!audioType) return;

        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);
        const recorder = new MediaRecorder(stream, { mimeType: audioType });
        let chunks = [];

        recorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        };

        recorder.onstop = async () => {
            if (recordingState === 1) { // recording was not cancelled
                const blob = new Blob(chunks, { type: audioType });
                handleSubmit(blob);
                setRecordingState(2);
            }
            setIsRecording(false);
            chunks = [];
        };

        recorder.start();  // TODO?: add 10ms to avoid missing the first part of the audio
        setMediaRecorder(recorder);
        setIsRecording(true);
        setRecordingState(1);
    };

    const stopRecording = () => {
        if (mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    };

    const cancelRecording = () => {
        if (mediaRecorder) {
            setRecordingState(0); // Reset to idle state
            mediaRecorder.stop();
            mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    };





    const handleSubmit = async (blob) => {
        const formData = new FormData();
        formData.append("audio", blob);
        formData.append("audio_mimetype", audioType);
        formData.append("text", "This is another text area but with text");

        try {
            const response = await fetch("http://127.0.0.1:8000/studydata/audio-analysis/", {
                method: "POST",
                headers: {
                    Authorization: "Bearer " + authTokens.access,
                },
                body: formData,
            });
            const data = await response.json();
            console.log("Submission Successful:", data);
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    const value = {
        isRecording,
        startRecording,
        stopRecording,
        cancelRecording,
        recordingState,
        analyser
    };

    return (
        <AudioRecordingContext.Provider value={value}>
            {children}
        </AudioRecordingContext.Provider>
    );
};
