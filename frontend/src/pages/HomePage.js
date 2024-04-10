import React, { useState, useContext } from "react";
import { useNotification } from "../context/NotificationContext";
import { isStudyStudent } from "../utils/RoleChecks";
import FirstQuestionnaire from "./FirstQuestionnaire";
import ToDo from "../components/ToDo";
import AuthContext from "../context/AuthContext";

const HomePage = () => {
	const { addNotification } = useNotification();
	const { user } = useContext(AuthContext);

	return (
		<div className="App">
			<p>Homepage</p>
			<button
				onClick={() =>
					addNotification("Error! Something went wrong.", "error")
				}
			>
				Show Error
			</button>
			{isStudyStudent(user) && <ToDo />}
		</div>
	);
};

export default HomePage;
