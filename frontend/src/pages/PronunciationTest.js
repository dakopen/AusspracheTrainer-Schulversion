import React, { useContext, useEffect, useState } from 'react';
import { fetchSentencesByCourseAndLocation } from '../utils/api';
import AuthContext from "../context/AuthContext";
import AusspracheTrainer from '../components/AusspracheTrainer';
import ProgressBar from '../components/ProgressBar';

const PronunciationTest = () => {
	const { authTokens } = useContext(AuthContext);
	const [sentences, setSentences] = useState([]);
	const [currentIndex, setCurrentIndex] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
			try {
				const result = await fetchSentencesByCourseAndLocation(1, 20, authTokens);
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
		if (currentIndex < sentences.length - 1) {
			setCurrentIndex(currentIndex + 1);
		} else {
			alert('You have completed the pronunciation test!');
		}
	};

	const currentSentence = sentences[currentIndex];

	const progressPercentage = ((currentIndex + 1) / sentences.length) * 100;

	return (
		<div>
			<ProgressBar percentage={progressPercentage} /> {/* ProgressBar displaying current progress */}
			{currentSentence ? (
				<AusspracheTrainer
					textareaText={currentSentence.sentence_as_text.sentence}
					sentenceId={currentSentence.id}
					audioUrl={currentSentence.audioUrl}
					onNextSentence={handleNextSentence} // Prop to handle moving to the next sentence
				/>
			) : (
				<div>No sentences found</div>
			)}
		</div>
	);
};

export default PronunciationTest;
