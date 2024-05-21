import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../../context/AuthContext";
import { fetchLowestPriorityUserToDo } from "../../utils/api";
import { Link } from "react-router-dom";
import './ToDo.css';

const ToDo = () => {
	const [userToDo, setUserToDo] = useState(null);
	const { authTokens } = useContext(AuthContext);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const getUserToDo = async () => {
			try {
				setIsLoading(true);
				const fetchedUserToDo = await fetchLowestPriorityUserToDo(
					authTokens
				);
				setUserToDo(fetchedUserToDo);
				setIsLoading(false);
			} catch (error) {
				console.error("Error fetching user ToDo:", error);
				setIsLoading(false);
				// Optionally, handle the error more gracefully, e.g., showing a message to the user
			}
		};

		getUserToDo();
	}, [authTokens]);

	if (isLoading) {
		return <div className="loading">Lädt...</div>;
	}

	if (!userToDo || Object.keys(userToDo).length === 0) {
		return (
			<div className="empty-todo">
				<div className="empty-todo-box">
					<span className="checkmark">✔</span>Nichts zu tun. Komme nächste Woche wieder :D<br></br><br></br>
					<small>Außerdem erhälst Du eine Mail als Benachrichtigung, wenn es ein neues Training gibt.</small>
				</div>
			</div>
		);
	}

	return (
		<div className="user-todo-container">
			<h3 className="user-todo-header">{userToDo.title}</h3>
			<span>{userToDo.description}</span>
			<div className="user-todo-detail">
				<Link to={userToDo.action_relative_link} className="user-todo-action-link">
					<button className="user-todo-button">starten</button>

				</Link>
			</div>
		</div>
	);
};

export default ToDo;
