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
        <>
            <div id="responsearea" className="response-container">
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
                                wordStyle = word.accuracy_score < 60 ? "darkred-word" :
                                    word.accuracy_score < 87 ? "yellow-word" : "black-word";
                                let time = timestamps[timestamp_index++][0] / 1000;
                                onClickHandler = () => jumpToWaveformTimestamp(time);
                                break;
                        }
                        return (
                            <span key={index} className={`response-word ${wordStyle}`} onClick={onClickHandler}>
                                {word.error_type === 'Omission' ? `[${word.word}]` : word.word}
                            </span>
                        );
                    })}
                </div>
            </div>
            <div id="response-area-scores" className="response-scores">
                {`Genauigkeit: ${Math.round(Paragraph.accuracy_score)} | Vollständigkeit: ${Math.round(Paragraph.completeness_score)} | Flüssigkeit: ${Math.round(Paragraph.fluency_score)}`}
            </div>
        </>
    );
};

export default DisplayResult;
