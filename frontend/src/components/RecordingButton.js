import React, { useEffect } from 'react';
import { useAudioRecording } from '../context/AudioRecordingContext';
//import "./RecordingButton.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faStop, faSpinner } from '@fortawesome/free-solid-svg-icons';

const AudioRecorder = ({ pollCompleted, resetRef }) => {
    const { isRecording, startRecording, stopRecording, cancelRecording, recordingState, setRecordingState } = useAudioRecording();

    const handleToggleRecording = () => {
        if (!isRecording) {
            resetRef.current = false;
            startRecording();
        } else {
            // short delay to allow the last audio buffer to be recorded
            setTimeout(() => stopRecording(), 200);

        }
    };

    const hideRecButton = () => {
        const recButtonContainer = document.getElementById('recording-button-container');
        recButtonContainer.style.display = 'none';
    }

    const showRecButton = () => {
        const recButtonContainer = document.getElementById('recording-button-container');
        recButtonContainer.style.display = 'flex';
    }


    useEffect(() => {
        if (resetRef.current == 0 || resetRef.current == 2) {
            if (recordingState == 2 && resetRef.current == 2) {
                hideRecButton();
            }
        } else {
            showRecButton();
            setRecordingState(0);
            resetRef.current = 0;
        }


    }, [recordingState, resetRef.current]);



    return (
        <div className="recording-button-container" id="recording-button-container">
            <button onClick={handleToggleRecording} className="recording-button glow-on-hover" id="recording-button" disabled={(recordingState == 2 && !pollCompleted.pollCompleted)}>
                {((recordingState == 0) || (pollCompleted && recordingState == 2 && pollCompleted.pollCompleted)) && <FontAwesomeIcon icon={faMicrophone} size="4x" className='start-recording-icon' />}
                {recordingState == 1 && <FontAwesomeIcon icon={faStop} size="3x" className="stop-recording-icon" />}
                {recordingState == 2 && !(pollCompleted && recordingState == 2 && pollCompleted.pollCompleted) && <FontAwesomeIcon icon={faSpinner} spin size='4x' className='analyzing-recording-icon' />}
                {/*isRecording ? "Stop and Submit" : "Start Recording"*/}
            </button>
            {isRecording && (
                <button onClick={cancelRecording} className="cancel-recording-button">
                    abbrechen
                </button>
            )}
        </div>
    );
};

export default AudioRecorder;
