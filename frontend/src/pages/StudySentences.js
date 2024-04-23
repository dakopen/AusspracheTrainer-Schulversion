import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
	fetchSentences,
	createSentence,
	updateSentence,
	deleteSentence,
} from "../utils/api";
import { isAdmin } from "../utils/RoleChecks";

const StudySentences = () => {
	const { authTokens, user } = useContext(AuthContext);
	const [sentences, setSentences] = useState([]);
	const [newSentence, setNewSentence] = useState("");
	const [newLanguage, setNewLanguage] = useState("1"); // Default to English
	const [editId, setEditId] = useState(null);
	const [editText, setEditText] = useState("");
	const [editLanguage, setEditLanguage] = useState("1");

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedSentences = await fetchSentences(authTokens);
				setSentences(fetchedSentences);
			} catch (error) {
				console.error("Error loading data:", error);
			}
		};

		loadData();
	}, [authTokens]);

	const handleDelete = async (id) => {
		try {
			await deleteSentence(id, authTokens);
			setSentences(sentences.filter((sentence) => sentence.id !== id));
		} catch (error) {
			console.error("Failed to delete the sentence:", error);
		}
	};

	const handleAddOrUpdate = async (id) => {
		const sentence = {
			sentence: id ? editText : newSentence,
			language: id ? editLanguage : newLanguage,
		};
		try {
			const updatedSentence = id
				? await updateSentence(sentence, id, authTokens)
				: await createSentence(sentence, authTokens);
			if (id) {
				setSentences(
					sentences.map((s) => (s.id === id ? updatedSentence : s))
				);
			} else {
				setSentences([...sentences, updatedSentence]);
			}
			setEditId(null);
			setNewSentence("");
			setNewLanguage("1");
		} catch (error) {
			console.error("Failed to add or update the sentence:", error);
		}
	};

	return (
		<div>
			{isAdmin(user) && (
				<div>
					<input
						type="text"
						value={newSentence}
						onChange={(e) => setNewSentence(e.target.value)}
						placeholder="Add a new sentence"
					/>
					<select
						value={newLanguage}
						onChange={(e) => setNewLanguage(e.target.value)}
					>
						<option value="1">Englisch</option>
						<option value="2">Französisch</option>
					</select>
					<button onClick={() => handleAddOrUpdate()}>
						Add New Sentence
					</button>
				</div>
			)}
			{sentences.map((sentence) => (
				<div key={sentence.id}>
					{editId === sentence.id ? (
						<div>
							<input
								type="text"
								value={editText}
								onChange={(e) => setEditText(e.target.value)}
							/>
							<select
								value={editLanguage}
								onChange={(e) =>
									setEditLanguage(e.target.value)
								}
							>
								<option value="1">Englisch</option>
								<option value="2">Französisch</option>
							</select>
							<button
								onClick={() => handleAddOrUpdate(sentence.id)}
							>
								Save
							</button>
						</div>
					) : (
						<p>
							{sentence.sentence} -{" "}
							{sentence.language === 1
								? "Englisch"
								: "Französisch"} -
							{sentence.synth_filename && (
								<audio
									controls
									src={sentence.synth_filename}
								></audio>

							)}
						</p>
					)}
					{isAdmin(user) && (
						<div>
							<button onClick={() => handleDelete(sentence.id)}>
								Delete
							</button>
							<button
								onClick={() => {
									setEditId(sentence.id);
									setEditText(sentence.sentence);
									setEditLanguage(sentence.language);
								}}
							>
								Edit
							</button>
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default StudySentences;
