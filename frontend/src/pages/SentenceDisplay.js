import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { fetchAverageScoresByCourseAndSentence } from '../utils/api';

function SentenceDisplay() {
    let { courseId, todoId } = useParams();
    const { authTokens } = useContext(AuthContext);
    const [sentenceData, setSentenceData] = useState([]);
    todoId = parseInt(todoId);
    useEffect(() => {
        const fetchSentences = async () => {
            let startLocation = 0;
            let endLocation = 0;
            console.log('Todo ID:', todoId)
            if (todoId === 4) {
                startLocation = 1;
                endLocation = 20;
            } else if (todoId >= 5 && todoId <= 10) {
                startLocation = todoId * 10 - 29;
                endLocation = todoId * 10 - 10;
            } else if (todoId === 12) {
                startLocation = 81;
                endLocation = 100;
            }

            try {
                const data = await fetchAverageScoresByCourseAndSentence(courseId, startLocation, endLocation, authTokens);
                console.log('Sentence data:', data.sentences)
                setSentenceData(data.sentences);  // Ensure data is set to the array of sentences
            } catch (error) {
                console.error('Error fetching sentence scores:', error);
                alert('Failed to fetch sentence scores.');
            }
        };

        fetchSentences();
    }, [courseId, todoId, authTokens]);

    const getWordStyle = (score) => {
        const red = (100 - Math.max(0, Math.min(score, 100))) * 2.55;
        const green = Math.max(0, Math.min(score, 100)) * 2.55;
        return { color: `rgb(${Math.round(red)}, ${Math.round(green)}, 0)` };
    };

    return (
        <div>
            <h1>Sentence Analysis for ToDo ID: {todoId}</h1>
            {sentenceData.length > 0 ? (
                sentenceData.map((item, index) => (
                    <div key={index}>
                        <h3>Sentence {index + 1}: {item.sentence_text}</h3>
                        <ul>
                            {item.scores.map((wordScore, idx) => (
                                <li key={idx} style={getWordStyle(wordScore.average_score)}>
                                    {wordScore.word}: {wordScore.average_score.toFixed(2)}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            ) : (
                <p>No sentence data found.</p>
            )}
        </div>
    );
}

export default SentenceDisplay;
