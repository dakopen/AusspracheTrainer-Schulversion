import React from 'react';
import { useAudioRecording } from '../context/AudioRecordingContext';
import "./RecordingButton.css";

const AudioRecorder = () => {
    const { isRecording, startRecording, stopRecording, cancelRecording, recordingState } = useAudioRecording();

    const handleToggleRecording = () => {
        if (!isRecording) {
            startRecording();
            console.log(recordingState, "RECSTATE INITIAL")
        } else {
            // short delay to allow the last audio buffer to be recorded
            setTimeout(() => stopRecording(), 200);
            console.log(recordingState, "RECSTATE")

        }
    };

    return (
        <div className="recording-button-container">
            <button onClick={handleToggleRecording} className="recording-button" id="recording-button">
                {isRecording ? "Stop and Submit" : "Start Recording"}
            </button>
            {isRecording && (
                <button onClick={cancelRecording} className="cancel-recording-button">
                    Cancel Recording
                </button>
            )}
        </div>
    );
};

export default AudioRecorder;
