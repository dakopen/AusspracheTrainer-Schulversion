import React, { useState, useEffect, useContext, startTransition } from 'react';
import { useParams } from 'react-router-dom';
import { fetchSentencesByCourseAndLocation } from '../utils/api';
import AuthContext from '../context/AuthContext';

function SentenceDisplay() {
    const { courseId, todoId } = useParams();
    const { authTokens } = useContext(AuthContext);
    const [sentences, setSentences] = useState([]);

    useEffect(() => {
        const fetchSentences = async () => {
            try {
                let start_location = 0;
                let end_location = 0;
                if (todoId == 4) {
                    start_location = 1;
                    end_location = 20;
                } else if (todoId >= 5 && todoId <= 10) {
                    start_location = todoId * 10 - 29;
                    end_location = todoId * 10 - 20;
                } else if (todoId == 12) {
                    start_location = 81;
                    end_location = 100;
                }
                const data = await fetchSentencesByCourseAndLocation(start_location, end_location, authTokens, courseId);
                console.log(data);
                setSentences(data);
            } catch (error) {
                console.error('Error fetching sentences:', error);
                alert('Failed to fetch sentences.');
            }
        };

        fetchSentences();
    }, [courseId, todoId, authTokens]);

    return (
        <div>
            <h1>Sentences for ToDo ID: {todoId}</h1>
            {sentences.length > 0 ? (
                <ul>
                    {sentences.map((sentence, index) => (
                        <li key={index}>{sentence.sentence_as_text.sentence}</li>
                    ))}
                </ul>
            ) : (
                <p>No sentences found.</p>
            )}
        </div>
    );
}

export default SentenceDisplay;
