import React, { useContext } from 'react';
import "./DisplayResult.css";

const DisplayResult = ({ result, jumpToWaveformTimestamp }) => {

    if (!result || !result[0] || !result[1]) {
        return null;
    }

    const { Paragraph, Words } = result[0];
    const timestamps = result[1];
    let timestamp_index = 0;
    return (
        <div id="response-area" className="response-container">
            <div className="words-container">
                {Words.map((word, index) => {
                    let wordStyle = "waveform-word";
                    let onClickHandler;
                    switch (word.error_type) {
                        case 'Omission':
                            wordStyle = "omission-word";
                            break;
                        case 'Insertion':
                            wordStyle = "insertion-word";
                            
                            
                            break;

                        case 'Mispronunciation':
                        case 'None':
                            wordStyle = word.accuracy_score < 70 ? "darkred-word" :
                                word.accuracy_score < 95 ? "yellow-word" : "black-word";
                            
                                onClickHandler = () => jumpToWaveformTimestamp(timestamps[timestamp_index++][0] / 1000);
                            break;
                    }
                    return (
                        <span key={index} className={`response-word ${wordStyle}`} onClick={onClickHandler}>
                            {word.error_type === 'Omission' ? `[${word.word}]` : word.word}
                        </span>
                    );
                })}
            </div>
            <div id="response-area-scores" className="response-scores">
                {`Accuracy: ${Math.round(Paragraph.accuracy_score)} | Completeness: ${Math.round(Paragraph.completeness_score)} | Fluency: ${Math.round(Paragraph.fluency_score)}`}
            </div>
        </div>
    );
};

export default DisplayResult;