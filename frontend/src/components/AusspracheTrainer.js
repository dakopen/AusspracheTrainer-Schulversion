import React from 'react'
import Textarea from "../components/Textarea";
import SpeechSynthesis from "../components/SpeechSynthesis";
import RecordingButton from "../components/RecordingButton";
import AudioVisualizer from "../components/AudioVisualizer";
import { AudioRecordingProvider } from "../context/AudioRecordingContext";

const AusspracheTrainer = ({ restricted, textareaText, sentenceId, audioUrl }) => {
    const [recordingState, setRecordingState] = useState(0);



    return (
        <>
            <Textarea textareaValue={textareaText} />
            <br></br>
            <AudioRecordingProvider sentenceId={sentenceId}>
                <RecordingButton setRecordingState={setRecordingState} />
                <br></br>
                <AudioVisualizer recordingState={recordingState} />
            </AudioRecordingProvider>
            {!restricted && <SpeechSynthesis audioUrl={audioUrl} />}
        </>
    )
}

export default AusspracheTrainer
