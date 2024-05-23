import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AusspracheTrainer from '../components/AusspracheTrainer/AusspracheTrainer';
import AuthContext from "../context/AuthContext";
import { useNotification } from '../context/NotificationContext';

import ProgressBar from '../components/ProgressBar';
import Tutorial from './Tutorial';  // Assume Tutorial is the Joyride configuration component
import { fetchSentencesByCourseAndLocation, completeStandardTodo } from '../utils/api';

const TutorialPage = () => {
    const { authTokens } = useContext(AuthContext);
    const [sentences, setSentences] = useState([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addNotification } = useNotification();
    const [todo_id, setTodo_id] = useState(-1);
    let navigate = useNavigate();

    useEffect(() => {

        const fetchData = async () => {
            try {
                const result = await fetchSentencesByCourseAndLocation(101, 102, authTokens);
                console.log("Fetched sentences:", result);
                setSentences(result);
            } catch (err) {
                console.error("Error fetching sentences:", err);
            }
        };
        fetchData();
    }, []);

    const handleNextSentence = () => {
        console.log("Handling next sentence")
        // Find the next incomplete sentence starting from the sentence after the current one
        const nextIndex = sentences.findIndex((sentence, index) => index > currentSentenceIndex && !sentence.is_completed);

        if (nextIndex !== -1) {
            // Set the next incomplete sentence if found
            setCurrentSentenceIndex(nextIndex);
        } else {
            // If no incomplete sentences are found after the current one, search from the beginning
            const wrapAroundIndex = sentences.findIndex((sentence, index) => index <= currentSentenceIndex && !sentence.is_completed);

            if (wrapAroundIndex !== -1) {
                setCurrentSentenceIndex(wrapAroundIndex);
            } else {
                // If no incomplete sentences are found at all, alert the user that the test is completed
                addNotification("Test completed", "success");
                //completeStandardTodo(todo_id, authTokens);

                // wait 100ms before navigating to the home page
                setTimeout(() => {
                    navigate("/");
                }, 100);

            }
        }
    };

    const markSentenceAsCompleted = (sentenceId) => {
        console.log("Marking sentence as completed:", sentenceId)
        const updatedSentences = sentences.map(sentence =>
            sentence.sentence === sentenceId ? { ...sentence, is_completed: true } : sentence
        );
        console.log(sentences, updatedSentences)
        setSentences(updatedSentences);
    };

    const handleSentenceClick = index => {
        if (todo_id == 4 || todo_id == 12) {
            if (sentences[index].is_completed) {
                alert("Du hast diesen Satz bereits abgeschlossen.");
            };
        };
        setCurrentSentenceIndex(index);
    }

    const debugCompleteAll = () => {
        setSentences(sentences.map(sentence => ({ ...sentence, is_completed: true })));
    };

    const currentSentence = sentences[currentSentenceIndex];



    return (
        <div style={{ zIndex: 0, position: "relative" }}>
            <ProgressBar sentences={sentences.map(sentence => sentence.is_completed)} onSentenceClick={handleSentenceClick} currentSentenceIndex={currentSentenceIndex} />
            <br></br>
            {console.log("currentSentence", currentSentence)}
            {currentSentence ? (
                <AusspracheTrainer
                    textareaText={currentSentence.sentence_as_text.sentence}
                    sentenceId={currentSentence.sentence}
                    audioUrl={currentSentence.sentence_as_text.synth_filename}
                    onNextSentence={handleNextSentence} // Prop to handle moving to the next sentence
                    onComplete={markSentenceAsCompleted}
                    isTest={todo_id == 4 || todo_id == 12}
                    allSentencesComplete={sentences.every(sentence => sentence.is_completed)}
                />
            ) : (
                <div>No sentences found</div>
            )}
            <Tutorial />
        </div>
    );
};

export default TutorialPage;
