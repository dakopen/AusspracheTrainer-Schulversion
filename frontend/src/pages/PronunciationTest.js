import React, { useContext, useEffect, useState } from 'react';
import { fetchSentencesByCourseAndLocation } from '../utils/api';
import AuthContext from "../context/AuthContext";
import AusspracheTrainer from '../components/AusspracheTrainer';
import ProgressBar from '../components/ProgressBar';
import { completeStandardTodo } from '../utils/api';
import { useNotification } from '../context/NotificationContext';
import { useNavigate } from "react-router-dom";

const PronunciationTest = () => {
	const { authTokens } = useContext(AuthContext);
	const [sentences, setSentences] = useState([]);
	const [currentSentenceIndex, setCurrentSentenceIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const { addNotification } = useNotification();
	let navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetchSentencesByCourseAndLocation(1, 20, authTokens);
				console.log("Fetched sentences:", result);
				setSentences(result);
				setLoading(false);
			} catch (err) {
				console.error("Error fetching sentences:", err);
				setError(err);
				setLoading(false);
			}
		};

		fetchData();
	}, [authTokens]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>Error: {error.message}</div>;

	const handleNextSentence = () => {
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
				completeStandardTodo(4, authTokens);
				navigate("/");

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
		setCurrentSentenceIndex(index);
	};

	const currentSentence = sentences[currentSentenceIndex];

	return (
		<div>
			<ProgressBar sentences={sentences.map(sentence => sentence.is_completed)} onSentenceClick={handleSentenceClick} currentSentenceIndex={currentSentenceIndex} />
			{currentSentence ? (
				<AusspracheTrainer
					textareaText={currentSentence.sentence_as_text.sentence}
					sentenceId={currentSentence.sentence}
					audioUrl={currentSentence.audioUrl}
					onNextSentence={handleNextSentence} // Prop to handle moving to the next sentence
					onComplete={markSentenceAsCompleted}
				/>
			) : (
				<div>No sentences found</div>
			)}
		</div>
	);
};

export default PronunciationTest;
