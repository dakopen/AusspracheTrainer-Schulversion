import React, { useEffect, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AusspracheTrainer from '../components/AusspracheTrainer/AusspracheTrainer';
import AuthContext from "../context/AuthContext";
import { useNotification } from '../context/NotificationContext';

import ProgressBar from '../components/ProgressBar';
import Tutorial from './Tutorial';  // Assume Tutorial is the Joyride configuration component
import { fetchSentencesByCourseAndLocation, completeStandardTodo, fetchLowestPriorityUserToDo } from '../utils/api';

const TutorialPage = () => {
    const { authTokens } = useContext(AuthContext);
    const [sentences, setSentences] = useState([]);
    const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addNotification } = useNotification();
    const [todo_id, setTodo_id] = useState(-1);
    const [startTour, setStartTour] = useState(true);
    const [initiallyStartTour, setInitiallyStartTour] = useState(false);
    const [runTour, setRunTour] = useState(true);
    const [firstTimeLoading, setFirstTimeLoading] = useState(true);
    const [allowOneTimeRepeat, setAllowOneTimeRepeat] = useState(false);

    const [tourSteps, setTourSteps] = useState([
        {
            target: '#textarea',
            content: 'Den Satz, der in diesem Textfeld steht sollst du vorlesen.',
            placement: 'top',
        },
        {
            target: '.player-button',
            content: 'Wenn du dir erstmal die korrekte Aussprache anhören möchtest, drücke auf diesen Button.',
            placement: 'top',
            spotlightClicks: true,
        },
        {
            target: '.recording-button-container',
            content: 'Drücke diesen Button und lese den Satz vor. Drücke ihn erneut, um die Aufnahme zu beenden.',
            placement: 'bottom',
            title: 'Jetzt bist du dran',
            spotlightClicks: false,
            styles: {
                tooltip: {
                    marginTop: -10,
                },
            },
        }]);



    let navigate = useNavigate();

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const result = await fetchLowestPriorityUserToDo(authTokens);
                console.log("Fetched todo:", result);
                let id = result.id;
                if (id == 3 || id == 11) {
                    setTodo_id(id);
                } else {
                    addNotification("Bitte die Aufgaben Reihenfolge einhalten.", "error");
                    navigate("/");
                }
            } catch (err) {
                console.error("Error fetching todo:", err);
            }
        };

        fetchTodo();
    }, [authTokens]);

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
        setAllowOneTimeRepeat(false);
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
                addNotification("Tutorial beendet", "success");
                //completeStandardTodo(todo_id, authTokens);
                completeStandardTodo(todo_id, authTokens)

                // wait 100ms before navigating to the home page
                setTimeout(() => {
                    navigate("/");
                }, 100);

            }
        }
    };


    useEffect(() => {
        if (!sentences[0]) return;
        if (firstTimeLoading && sentences[0].is_completed) {
            setFirstTimeLoading(false);
            handleNextSentence();
        } else if (firstTimeLoading) {
            setFirstTimeLoading(false);
        }
    }, [sentences]);

    const generateTourSteps = () => {
        return [
            {
                target: "#replay-button",
                content: "Hier kannst du dir deine Aussprache nochmal anhören. Die Farben zeigen dir, wie gut du warst.",
                placement: 'left-start',
                disableOverlay: true,
                disableBeacon: true,
            },
            {
                target: "#responsearea",
                content: "In diesem Feld siehst du, was die KI verstanden hat. Tipp: Klicke auf die Wörter, um die Audio bis zu dem Wort zu verschieben. Anschließend kannst du sie dir anhören, indem du auf das eben gezeigte Play Symbol klickst.",
                placement: 'left-start',
                disableOverlay: true,
            },
            {
                target: ".restricted-access-overlay",
                content: "Du gehörst zur Kontrollgruppe. Daher erhälst du erst am Ende der Studie eine Rückmeldung zu deinen Ergebnissen.",
                placement: 'left-start',
                disableOverlay: true,
                disableBeacon: true,
            },
            {
                target: ".repeat-training-button",
                content: "Drücke hier, um den Satz erneut aufzunehmen (nur im Training möglich, nicht im Test).",
                placement: 'top',
                disableOverlayClose: true,
            },
            {
                target: ".next-sentence-or-finish",
                content: "Drücke hier, um zum nächsten Satz zu gelangen (oder den Test abzuschließen).",
                placement: 'top',
            }
        ]
    }

    const markSentenceAsCompleted = (sentenceId) => {
        console.log("Marking sentence as completed:", sentenceId)
        const updatedSentences = sentences.map(sentence =>
            sentence.sentence === sentenceId ? { ...sentence, is_completed: true } : sentence
        );
        console.log(sentences, updatedSentences)
        allowOneTimeRepeat(false);
        setRunTour(false);
        setSentences(updatedSentences);

        setTimeout(() => {
            setRunTour(true);
            setTourSteps(generateTourSteps());

        }, 3000);
    };

    const handleSentenceClick = index => {
        if (todo_id == 4 || todo_id == 12) {
            if (sentences[index].is_completed) {
                alert("Du hast diesen Satz bereits abgeschlossen.");
            };
        };
        setCurrentSentenceIndex(index);
        setAllowOneTimeRepeat(false);
    }

    const debugCompleteAll = () => {
        setSentences(sentences.map(sentence => ({ ...sentence, is_completed: true })));
    };

    const currentSentence = sentences[currentSentenceIndex];

    useEffect(() => {
        setTimeout(() => {
            setInitiallyStartTour(true);
        }, 1000);
    }, []);



    const audioNotRight = () => {
        addNotification("Es gab Probleme bei der Analyse der Audio. Bitte überprüfe dein Mikrofon.", "error");
        setAllowOneTimeRepeat(true);
    }

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
                    onAudioNotRight={audioNotRight}
                    allowOneTimeRepeat={allowOneTimeRepeat}
                />
            ) : (
                <div>No sentences found</div>
            )}
            <Tutorial steps={tourSteps} onTourComplete={() => setStartTour(false)} run={runTour} startTour={initiallyStartTour} />
        </div>
    );
};

export default TutorialPage;
