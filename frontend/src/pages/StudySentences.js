import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import {
	fetchSentences,
	createSentences,
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
	const [languageFilter, setLanguageFilter] = useState("all"); // New state for language filter

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
		if (window.confirm("Are you sure you want to delete this sentence?")) {
			try {
				await deleteSentence(id, authTokens);
				setSentences(sentences.filter((sentence) => sentence.id !== id));
			} catch (error) {
				console.error("Failed to delete the sentence:", error);
			}
		}
	};

	const handleAddOrUpdate = async () => {
		if (editId) {
			const sentence = {
				sentence: editText,
				language: editLanguage,
			};
			try {
				const updatedSentence = await updateSentence(sentence, editId, authTokens);
				setSentences(sentences.map((s) => (s.id === editId ? updatedSentence : s)));
				setEditId(null);
				setEditText("");
				setEditLanguage("1");
			} catch (error) {
				console.error("Failed to update the sentence:", error);
			}
		} else {
			const sentenceObjects = newSentence.split('\n').map(sentenceText => ({
				sentence: sentenceText,
				language: newLanguage,
			}));
			try {
				const createdSentences = await createSentences(sentenceObjects, authTokens);
				setSentences([...sentences, ...createdSentences]);
				setNewSentence("");
			} catch (error) {
				console.error("Failed to create sentences:", error);
			}
		}
	};

	return (
		<div>
			{isAdmin(user) && (
				<div>
					<textarea
						value={newSentence}
						onChange={(e) => setNewSentence(e.target.value)}
						placeholder="Add new sentences (one per line)"
					/>
					<select
						value={newLanguage}
						onChange={(e) => setNewLanguage(e.target.value)}
					>
						<option value="1">English</option>
						<option value="2">French</option>
					</select>
					<button onClick={handleAddOrUpdate}>
						Add New Sentences
					</button>
				</div>
			)}
			<select
				value={languageFilter}
				onChange={(e) => setLanguageFilter(e.target.value)}
				style={{ marginBottom: "10px" }}
			>
				<option value="all">All Languages</option>
				<option value="1">English</option>
				<option value="2">French</option>
			</select>
			{sentences
				.filter((sentence) => languageFilter === "all" || sentence.language.toString() === languageFilter)
				.map((sentence) => (
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
									onChange={(e) => setEditLanguage(e.target.value)}
								>
									<option value="1">English</option>
									<option value="2">French</option>
								</select>
								<button onClick={() => handleAddOrUpdate(sentence.id)}>
									Save
								</button>
							</div>
						) : (
							<p>
								{sentence.sentence} -{" "}
								{sentence.language === 1 ? "English" : "French"}
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
