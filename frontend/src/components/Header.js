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
				</>
			)}
			{isTeacher(user) && (
				<>
					<Link to="/">Home</Link>
					<br></br>
					<Link to="/courses">Kurse</Link>
				</>
			)}
			{isSecretary(user) && (
				<>
					<Link to="/">Home</Link>
					<br></br>
					<Link to="/create-teacher">Lehreraccount erstellen</Link>
					<br></br>
					<Link to="/courses">Kurse</Link>
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
				</>
			)}

			<br></br>
			{user ? (
				<p onClick={logoutUser}>Logout</p>
			) : (
				<>
					<Link to="/rolelogin">Role-Login</Link>
					<br></br>
					<Link to="/login">Login</Link>
				</>
			)}
			{user && <p>Hello user with Role: {user.role}</p>}
			<hr></hr>
		</div>
	);
};

export default Header;
