import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { fetchAverageScoresByCourseAndSentence } from '../utils/api';

function SentenceDisplay() {
    const { courseId, todoId } = useParams();
    const { authTokens } = useContext(AuthContext);
    const [sentenceData, setSentenceData] = useState([]);
    const [language, setLanguage] = useState('en-GB');

    useEffect(() => {
        const fetchSentences = async () => {
            let startLocation = 0;
            let endLocation = 0;

            if (parseInt(todoId) === 4) {
                startLocation = 1;
                endLocation = 20;
            } else if (parseInt(todoId) >= 5 && parseInt(todoId) <= 10) {
                startLocation = parseInt(todoId) * 10 - 29;
                endLocation = parseInt(todoId) * 10 - 20;
            } else if (parseInt(todoId) === 12) {
                startLocation = 81;
                endLocation = 100;
            }

            try {
                const data = await fetchAverageScoresByCourseAndSentence(courseId, startLocation, endLocation, authTokens);
                setSentenceData(data.sentences);
                console.log(data, "LANGGGG")
                if (data.language == 1) {
                    setLanguage('en-GB');
                } else {
                    setLanguage('fr-FR');
                }
            } catch (error) {
                console.error('Error fetching sentence scores:', error);
                alert('Failed to fetch sentence scores.');
            }
        };

        fetchSentences();
    }, [courseId, todoId, authTokens]);

    const getWordStyle = (score) => {
        if (score === -1) {
            return { color: 'grey' };
        }
        const red = (100 - Math.max(0, Math.min(score, 100))) * 2.55;
        const green = Math.max(0, Math.min(score, 100)) * 2.55;
        return { color: `rgb(${Math.round(red)}, ${Math.round(green)}, 0)` };
    };

    const todoIdToNaturalLanguage = (todoId) => {

        if (parseInt(todoId) === 4) {
            return 'den Anfangstest';
        } else if (parseInt(todoId) >= 5 && parseInt(todoId) <= 10) {
            return `die ${parseInt(todoId) - 4}. Übung (zuhause)`;
        } else if (parseInt(todoId) === 12) {
            return 'den Abschlusstest';
        }
    };

    return (
        <div>
            <h1>Aggregierte Satzrückmeldung des Kurses für {todoIdToNaturalLanguage(todoId)}</h1>
            <h3>Farbskala</h3>
            <div className="score-container">
                <div className="score-labels">
                    <span>0</span>
                    <span>100 (sehr gut)</span>
                </div>
                <div className="score-bar"></div>

            </div>
            <div>
                <span className="placeholder">Grau: noch keine Daten</span>
            </div>
            {sentenceData.length > 0 ? (
                sentenceData.map((item, index) => (
                    <div key={index} className='sentence-display-container'>
                        <p className="sentence-display-text">
                            Satz {index + 1}: &nbsp;
                            {item.scores.map((wordScore, idx) => (
                                <span key={idx} style={getWordStyle(wordScore.average_score)} title={`⌀ Score: ${wordScore.average_score === -1 ? "?" : wordScore.average_score}`}>
                                    {wordScore.word}{idx < item.scores.length - 1 ? ' ' : ''}
                                </span>
                            ))}
                            &nbsp;&nbsp;
                            <a href={`https://www.aussprachetrainer.org/de/?text=${encodeURIComponent(item.sentence_text)}&language=${language}`} target="_blank" rel="noopener">
                                <button>
                                    Selber üben
                                </button>
                            </a>
                        </p>
                    </div>
                ))
            ) : (

                <p>Lädt... (sollte das länger als einige Sekunden angezeigt werden handelt es sich um einen technischen Fehler, der schnellstmöglich behoben wird)</p>
            )}

            <br></br>
            <Link to={`/courses/${courseId}`}>
                <button>
                    Zurück zum Kurs
                </button>
            </Link>
        </div>
    );
}

export default SentenceDisplay;
