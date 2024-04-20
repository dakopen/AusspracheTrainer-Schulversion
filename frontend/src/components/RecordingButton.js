import React from 'react';
import { useAudioRecording } from '../context/AudioRecordingContext';
import "./RecordingButton.css";

const AudioRecorder = () => {
    const { isRecording, startRecording, stopRecording, cancelRecording } = useAudioRecording();

    const handleToggleRecording = () => {
        if (!isRecording) {
            startRecording();
        } else {
            stopRecording();
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
