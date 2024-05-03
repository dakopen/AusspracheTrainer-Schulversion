import React, { useContext } from 'react'
import { fetchSentencesByCourseAndLocation } from '../utils/api'
import AuthContext from "../context/AuthContext";

const PronunciationTest = () => {
	const { authTokens } = useContext(AuthContext);

	let sentences = fetchSentencesByCourseAndLocation(1, 20, authTokens)
	console.log(sentences)
	return (
		<div>

		</div>
	)
}

export default PronunciationTest
