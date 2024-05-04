import React, { useState, useContext } from 'react'
import Textarea from "../components/Textarea";
import SpeechSynthesis from "../components/SpeechSynthesis";
import RecordingButton from "../components/RecordingButton";
import AudioVisualizer from "../components/AudioVisualizer";
import { AudioRecordingProvider } from "../context/AudioRecordingContext";
import AuthContext from '../context/AuthContext';


const AusspracheTrainer = ({ textareaText, sentenceId, audioUrl, onNextSentence, onComplete }) => {
    const [recordingState, setRecordingState] = useState(0);
    const { user } = useContext(AuthContext);


    return (
        <>
            <Textarea textareaValue={textareaText} />
            <br></br>
            {console.log("sentence Id: ", sentenceId)}
            <AudioRecordingProvider sentenceId={sentenceId} onComplete={onComplete}>
                <RecordingButton setRecordingState={setRecordingState} />
                <br></br>
                <AudioVisualizer recordingState={recordingState} />
            </AudioRecordingProvider>
            {user.full_access_group && <SpeechSynthesis audioUrl={audioUrl} />}
            <button onClick={onNextSentence}>Next Sentence</button> {/* Button to proceed to the next sentence */}
        </>
    )
}

export default AusspracheTrainer
