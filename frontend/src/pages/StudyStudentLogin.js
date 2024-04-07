import React, { useContext } from "react";
import AuthContext from "../context/AuthContext";

const StudyStudentLogin = () => {
	let { sendToStudyStudentLogin } = useContext(AuthContext);
	return (
		<div>
			<form onSubmit={sendToStudyStudentLogin}>
				<input
					type="text"
					name="username"
					placeholder="Benutzernamen eingeben"
				/>
				<input type="submit" />
			</form>
		</div>
	);
};

export default StudyStudentLogin;
