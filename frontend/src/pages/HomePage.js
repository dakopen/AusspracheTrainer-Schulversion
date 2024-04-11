import React, { useState, useContext } from "react";
import { useNotification } from "../context/NotificationContext";
import { isStudyStudent } from "../utils/RoleChecks";
import ToDo from "../components/ToDo";
import AuthContext from "../context/AuthContext";

import Textarea from "../components/Textarea";

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
			{/*<Textarea textareaValue="This is a text area" />*/}
			<br></br>
			<Textarea textareaValue="This is another text area but with text so long that it wraps into multiple lines letting me test advanced things." />
		</div>
	);
};

export default HomePage;
