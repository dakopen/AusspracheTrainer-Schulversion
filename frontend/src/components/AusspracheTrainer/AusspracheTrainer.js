import React, { useState, useContext, useEffect, useRef } from 'react'
import Textarea from "../Textarea";
import SpeechSynthesis from "../SpeechSynthesis";
import RecordingButton from "../RecordingButton";
import AudioVisualizer from "../AudioVisualizer";

import { AudioRecordingProvider } from "../../context/AudioRecordingContext";
import AuthContext from '../../context/AuthContext';
import { checkTaskStatus } from '../../utils/api'
import './AusspracheTrainer.css'
import './RecordingButton.css'

const AusspracheTrainer = ({ textareaText, sentenceId, audioUrl, onNextSentence, onComplete, isTest }) => {
    const { user } = useContext(AuthContext);
    const [taskId, setTaskId] = useState(null);
    const [taskStatus, setTaskStatus] = useState("PENDING");
    const { authTokens } = useContext(AuthContext);
    const [result, setResult] = useState(null);
    const [pollCompleted, setPollCompleted] = useState(false);
    const resetRef = useRef(0);

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
                    setPollCompleted(true);
                }
                if (data.status === "SUCCESS") {
                    console.log()
                    setResult(data.result);
                    console.log(data)
                    resetRef.current = 2;

                }
            }, 500); // Poll every 500ms
        }
    }

    const reset = () => {
        setPollCompleted(false);
        setTaskStatus("PENDING");
        setResult(null);
        resetRef.current = 1;
    }

    useEffect(() => {  // change everything, when sentence changes
        reset();
    }, [sentenceId])

    return (
        <div className='aussprachetrainer-container'>
            <Textarea textareaValue={textareaText} />
            <br></br>
            {console.log("sentence Id: ", sentenceId)}
            <AudioRecordingProvider sentenceId={sentenceId} onComplete={onComplete} setTaskId={setTaskId}>
                <AudioVisualizer result={result} setResult={setResult} />
                <br></br>
                <RecordingButton pollCompleted={pollCompleted} resetRef={resetRef} />
            </AudioRecordingProvider>
            {user.full_access_group ? <SpeechSynthesis audioUrl={audioUrl} /> : <>
                <div style={{ marginTop: "50px" }}>

                </div>
            </>}
            <div>
                {!isTest && <button onClick={reset}>Erneut vorlesen</button>} {console.log(isTest, "isTest")}

                <button onClick={onNextSentence}>Nächster Satz</button> {/* Button to proceed to the next sentence */}
            </div>
        </div>
    )
}

export default AusspracheTrainer
