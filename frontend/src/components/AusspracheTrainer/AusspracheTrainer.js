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
import { faRedo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AusspracheTrainer = ({ textareaText, sentenceId, audioUrl, onNextSentence, onComplete, isTest, allSentencesComplete, onAudioNotRight, allowOneTimeRepeat }) => {
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
                setTaskStatus(data.status);
                if (data.status === "SUCCESS" || data.status === "FAILURE") {
                    clearInterval(intervalId);
                    setPollCompleted(true);
                }
                if (data.status === "SUCCESS") {
                    setResult(data.result);
                    resetRef.current = 2;


                    if (data.result && data.result[0] && data.result[0].Paragraph && data.result[0].Paragraph.completeness_score > 25) { // not empty audio
                        onComplete(sentenceId);
                    } else {
                        onAudioNotRight();
                    }


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
            <AudioRecordingProvider sentenceId={sentenceId} onComplete={onComplete} setTaskId={setTaskId}>
                <AudioVisualizer result={result} setResult={setResult} isTest={isTest} />
                <br></br>
                <RecordingButton pollCompleted={pollCompleted} resetRef={resetRef} />
            </AudioRecordingProvider>
            {(user.full_access_group && !isTest) ? <SpeechSynthesis audioUrl={audioUrl} /> : <>
                <div style={{ marginTop: "50px" }}>

                </div>
            </>}
            <div className='buttons-below-aussprachetrainer'>
                <button className='hidden'>{allSentencesComplete ? `${isTest ? "Test" : "Übung"} abschließen` : "Nächster Satz"}</button> {/* Button to proceed to the next sentence */}
                {(!isTest || allowOneTimeRepeat) && <button onClick={reset} className={pollCompleted ? "repeat-training-button" : "hidden repeat-training-button"}>
                    <FontAwesomeIcon icon={faRedo} size="xs" /> Erneut üben</button>}
                <button onClick={onNextSentence} className='next-sentence-or-finish'>{allSentencesComplete ? `${isTest ? "Test" : "Übung"} abschließen` : "Nächster Satz"}</button> {/* Button to proceed to the next sentence */}
            </div>
        </div>
    )
}

export default AusspracheTrainer
