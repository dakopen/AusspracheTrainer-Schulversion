import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import {
	isTeacher,
	isSecretary,
	isAdmin,
	isStudyStudent,
	isTeacherOrSecretary,
	isTeacherOrAdmin,
	isSecretaryOrAdmin,
	isTeacherOrSecretaryOrAdmin,
} from "../utils/RoleChecks";

const Header = () => {
	let { user, logoutUser } = useContext(AuthContext);
	return (
		<div>
			{isStudyStudent(user) && (
				<>
					<Link to="/">Home</Link>
					<br></br>
					<Link to="/account-settings">Account Einstellungen</Link>
				</>
			)}
			{isTeacher(user) && (
				<>
					<Link to="/">Home</Link>
					<br></br>
					<Link to="/courses">Kurse</Link>
					<br></br>
					<Link to="/sentences">Sätze</Link>
				</>
			)}
			{isSecretary(user) && (
				<>
					<Link to="/">Home</Link>
					<br></br>
					<Link to="/create-teacher">Lehreraccount erstellen</Link>
					<br></br>
					<Link to="/courses">Kurse</Link>
					<br></br>
					<Link to="/sentences">Sätze</Link>
				</>
			)}
			{isAdmin(user) && (
				<>
					<Link to="/">Home</Link>
					<br></br>
					<Link to="/create-teacher">Lehreraccount erstellen</Link>
					<span> | </span>
					<Link to="/create-any-role">Staff Account erstellen</Link>
					<br></br>
					<Link to="/courses">Kurse</Link>
					<span> | </span>
					<Link to="/schools">Schulen</Link>
					<br></br>
					<Link to="/sentences">Sätze</Link>
				</>
			)}

			<br></br>
			{user ? (
				<p onClick={logoutUser}>Logout</p>
			) : (
				<>
					<Link to="/rolelogin">Role-Login</Link>
					<br></br>
					<Link to="/login">Login</Link> |{" "}
					<Link to="/request-password-reset">Passwort vergessen</Link>

				</>
			)}
			{user && (
				<p>
					Hello user with Role: {user.role} with the study language:{" "}
					{user.language === 1 ? "Englisch" : "Französisch"} and{" "}
					{user.full_access_group === true
						? "Full Access"
						: "Restricted Access"}
				</p>
			)}
			<hr></hr>
		</div>
	);
};

export default Header;
