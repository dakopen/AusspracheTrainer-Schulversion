import React, { useContext, useEffect, useState } from 'react';
import { fetchSentencesByCourseAndLocation } from '../utils/api';
import AuthContext from "../context/AuthContext";
import AusspracheTrainer from '../components/AusspracheTrainer/AusspracheTrainer';
import ProgressBar from '../components/ProgressBar';
import { completeStandardTodo, fetchLowestPriorityUserToDo } from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from "react-router-dom";

const PronunciationTest = () => {
	const { authTokens } = useContext(AuthContext);
	const [sentences, setSentences] = useState([]);
	const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { addNotification } = useNotification();
	const [todo_id, setTodo_id] = useState(-1);
	const [firstTimeLoading, setFirstTimeLoading] = useState(true);
	let navigate = useNavigate();
	const [allowOneTimeRepeat, setAllowOneTimeRepeat] = useState(false);


	useEffect(() => {
		const fetchTodo = async () => {
			try {
				const result = await fetchLowestPriorityUserToDo(authTokens);
				console.log("Fetched todo:", result);
				let id = result.id;
				setTodo_id(id);
				console.log(id, "id")
				// check if todo_id is between 5 and 10
				if (id === 4) {
					let start_location = 1;
					let end_location = 20;
					fetchData(start_location, end_location);

				} else if (id === 12) {  // 5-10 are weekly trainings, 11 is tutorial
					let start_location = 81;
					let end_location = 100;
					fetchData(start_location, end_location);

				} else if (id >= 5 && id <= 10) {
					let start_location = id * 10 - 29;
					let end_location = id * 10 - 20;
					fetchData(start_location, end_location);
				} else {
					addNotification("Bitte die Aufgaben Reihenfolge einhalten.", "error");
					console.log(id, "id")
					navigate("/");
				}
			} catch (err) {
				console.error("Error fetching todo:", err);
				setError(err);
				setLoading(false);
			}
		};


		const fetchData = async (start_location, end_location) => {
			try {
				const result = await fetchSentencesByCourseAndLocation(start_location, end_location, authTokens);
				console.log("Fetched sentences:", result);
				setSentences(result);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching sentences:", err);
				setError(err);
				setLoading(false);
			}
		};
		fetchTodo();
	}, [authTokens]);


	useEffect(() => {
		if (!sentences[0]) return;
		if (firstTimeLoading && sentences[0].is_completed) {
			setFirstTimeLoading(false);
			handleNextSentence();
		} else if (firstTimeLoading) {
			setFirstTimeLoading(false);
		}
	}, [sentences]);


	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

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
				addNotification("Test abgeschlossen", "success");
				completeStandardTodo(todo_id, authTokens);
				

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
		setAllowOneTimeRepeat(false);

	};

	const handleSentenceClick = index => {
		if (todo_id == 4 || todo_id == 12) {
			if (sentences[index].is_completed) {
				alert("Du hast diesen Satz bereits abgeschlossen.");
				return;
			};
		};
		setCurrentSentenceIndex(index);
		setAllowOneTimeRepeat(false);
	}

	const debugCompleteAll = () => {
		setSentences(sentences.map(sentence => ({ ...sentence, is_completed: true })));
	};

	const currentSentence = sentences[currentSentenceIndex];

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
			<button onClick={debugCompleteAll}>DEBUG: Complete all</button>
		</div>
	);
};

export default PronunciationTest;
