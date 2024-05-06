import React, { useState, useContext, useEffect } from 'react'
import Textarea from "../components/Textarea";
import SpeechSynthesis from "../components/SpeechSynthesis";
import RecordingButton from "../components/RecordingButton";
import AudioVisualizer from "../components/AudioVisualizer";
import { AudioRecordingProvider } from "../context/AudioRecordingContext";
import AuthContext from '../context/AuthContext';
import { checkTaskStatus } from '../utils/api'


const AusspracheTrainer = ({ textareaText, sentenceId, audioUrl, onNextSentence, onComplete }) => {
    const [recordingState, setRecordingState] = useState(0);
    const { user } = useContext(AuthContext);
    const [taskId, setTaskId] = useState(null);
    const [taskStatus, setTaskStatus] = useState("PENDING");
    const { authTokens } = useContext(AuthContext);
    const [result, setResult] = useState(null);

    useEffect(() => {
        pollTaskStatus();
    }, [taskId]);

    const pollTaskStatus = () => {
        if (taskId) {
            const intervalId = setInterval(async () => {
                const data = await checkTaskStatus(taskId, authTokens);
                console.log(data.status)
                setTaskStatus(data.status);
                if (data.status === "SUCCESS" || data.status === "FAILURE") {
                    clearInterval(intervalId);
                }
                if (data.status === "SUCCESS") {
                    console.log()
                    setResult(data.result);
                    console.log(data)

                }
            }, 500); // Poll every 500ms
        }
    }

    return (
        <>
            <Textarea textareaValue={textareaText} />
            <br></br>
            {console.log("sentence Id: ", sentenceId)}
            <AudioRecordingProvider sentenceId={sentenceId} onComplete={onComplete} setTaskId={setTaskId}>
                <RecordingButton setRecordingState={setRecordingState} />
                <br></br>
                <AudioVisualizer result={result} />
            </AudioRecordingProvider>
            {user.full_access_group && <SpeechSynthesis audioUrl={audioUrl} />}
            <button onClick={onNextSentence}>Next Sentence</button> {/* Button to proceed to the next sentence */}
        </>
    )
}

export default AusspracheTrainer
