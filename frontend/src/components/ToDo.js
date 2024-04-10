import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchLowestPriorityUserToDo } from "../utils/api";

const UserToDoComponent = () => {
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
		return <div>Lädt...</div>;
	}

	if (!userToDo) {
		return <div>Nichts zu tun.</div>;
	}

	return (
		<div>
			<h3>Your ToDo:</h3>
			<p>Title: {userToDo.title}</p>
			<p>Description: {userToDo.description}</p>
			<p>Priority: {userToDo.priority}</p>
			<p>
				Action Link:{" "}
				<a href={userToDo.action_relative_link}>verlinkt</a>
			</p>
		</div>
	);
};

export default UserToDoComponent;
