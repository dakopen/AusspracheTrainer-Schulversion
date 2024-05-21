import React, { useEffect } from 'react';
import { useAudioRecording } from '../context/AudioRecordingContext';
//import "./RecordingButton.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMicrophone, faStop, faSpinner } from '@fortawesome/free-solid-svg-icons';

const AudioRecorder = (pollCompleted) => {
    const { isRecording, startRecording, stopRecording, cancelRecording, recordingState, setRecordingState } = useAudioRecording();

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

    const moveCanvasDown = () => {
        const canvasParentContainer = document.getElementById('canvas-parent-container');
        canvasParentContainer.style.marginTop = canvasParentContainer.style.marginTop + 10 + 'px';

    }

    useEffect(() => {
        if (pollCompleted.pollCompleted) {
            console.log("poll completed", pollCompleted)
            moveCanvasDown();
        }
    }, [pollCompleted]);

    return (
        <div className="recording-button-container">
            <button onClick={handleToggleRecording} className="recording-button" id="recording-button">
                {((recordingState == 0) || (pollCompleted && recordingState == 2 && pollCompleted.pollCompleted)) && <FontAwesomeIcon icon={faMicrophone} size="4x" className='start-recording-icon' />}
                {recordingState == 1 && <FontAwesomeIcon icon={faStop} size="3x" className="stop-recording-icon" />}
                {recordingState == 2 && !(pollCompleted && recordingState == 2 && pollCompleted.pollCompleted) && <FontAwesomeIcon icon={faSpinner} spin size='4x' className='analyzing-recording-icon' />}
                {/*isRecording ? "Stop and Submit" : "Start Recording"*/}
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
