import React, { useContext, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import {
	isTeacher,
	isSecretary,
	isAdmin,
	isStudyStudent,
} from "../../utils/RoleChecks";
import './Header.css'


const Header = () => {
	const { user, logoutUser } = useContext(AuthContext);
	const hamburgerRef = useRef(null);
	const navMenuRef = useRef(null);
	const navBarRef = useRef(null);

	const mobileMenu = () => {
		hamburgerRef.current.classList.toggle("active");
		navMenuRef.current.classList.toggle("active");
		document.body.classList.toggle("unscrollable");
	};

	

	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY === 0) {
				navBarRef.current.style.boxShadow = "";
				navBarRef.current.style.backgroundColor = "var(--white)";
			} else {
				navBarRef.current.style.boxShadow = "0px 0px 6px 2px var(--lila)";
				navBarRef.current.style.backgroundColor = "var(--white-rosa)";
			}
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const closeMobileMenu = () => {
        if (navMenuRef.current.classList.contains("active")) {
            hamburgerRef.current.classList.remove("active");
            navMenuRef.current.classList.remove("active");
            document.body.classList.remove("unscrollable");
        }
    };

	const logoutAndCloseMenu = () => {
		logoutUser();
		closeMobileMenu();
	}

	return (
		<>
			<header className="header">
				<nav className="navbar" ref={navBarRef}>
					<Link to="/" className="nav-logo" onClick={closeMobileMenu}>
						<img src="https://placehold.co/600x200" height={65} alt="Studienlogo"></img>
					</Link>
					<ul className="nav-menu" ref={navMenuRef}>
						{isStudyStudent(user) && (
							<>
								<li className="nav-item">
									<Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
								</li>
								<li className="nav-item">
									<Link to="/account-settings" className="nav-link" onClick={closeMobileMenu}>Account Einstellungen</Link>
								</li>
							</>
						)}
						{isTeacher(user) && (
							<>
								<li className="nav-item">
									<Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
								</li>
								<li className="nav-item">
									<Link to="/courses" className="nav-link" onClick={closeMobileMenu}>Kurse</Link>
								</li>
							</>
						)}
						{isSecretary(user) && (
							<>
								<li className="nav-item">
									<Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
								</li>
								<li className="nav-item">
									<Link to="/create-teacher" className="nav-link" onClick={closeMobileMenu}>Lehreraccount erstellen</Link>
								</li>
								<li className="nav-item">
									<Link to="/courses" className="nav-link" onClick={closeMobileMenu}>Kurse</Link>
								</li>
							</>
						)}

						{isAdmin(user) && (
							<>
								<li className="nav-item">
									<Link to="/" className="nav-link" onClick={closeMobileMenu}>Home</Link>
								</li>
								<li className="nav-item">
									<Link to="/create-any-role" className="nav-link" onClick={closeMobileMenu}>Staff Account erstellen</Link>
								</li>
								<li className="nav-item">
									<Link to="/courses" className="nav-link" onClick={closeMobileMenu}>Kurse</Link>
								</li>
								<li className="nav-item">
									<Link to="/schools" className="nav-link" onClick={closeMobileMenu}>Schulen</Link>
								</li>
								<li className="nav-item">
									<Link to="/sentences" className="nav-link" onClick={closeMobileMenu}>Sätze</Link>
								</li>
							</>
						)}

						{user ? (
							<li className="nav-item nav-link" onClick={logoutAndCloseMenu}>Logout</li>
						) : (
							<>
								<li className="nav-item">
									<Link to="/login" className="nav-link" onClick={closeMobileMenu}>Login</Link>
								</li>
								<li className="nav-item">
									<Link to="/rolelogin" className="nav-link" onClick={closeMobileMenu}>Lehrer-Login</Link>
								</li>
								<li className="nav-item">
									<Link to="/request-password-reset" className="nav-link" onClick={closeMobileMenu}>Passwort vergessen</Link>
								</li>
								<li className="nav-item">
									<Link to="/forgot-username" className="nav-link" onClick={closeMobileMenu}>Benutzername vergessen</Link>
								</li>
							</>
						)}

					</ul>
					<div className="hamburger" ref={hamburgerRef} onClick={mobileMenu}>
						<span className="bar"></span>
						<span className="bar"></span>
						<span className="bar"></span>
					</div>

				</nav>
			</header >
			<div className="margin-for-header"></div>
			{user &&
				<p>
					Hello user with Role: {user.role} with the study language:{" "}
					{user.language === 1 ? "Englisch" : "Französisch"} and{" "}
					{user.full_access_group === true
						? "Full Access"
						: "Restricted Access"}
				</p>
			}




			{/*
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
						<Link to="/request-password-reset">Passwort vergessen</Link> |{" "}
						<Link to="/forgot-username">Benutzername vergessen</Link>


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
			*/}
		</>
	);
};

export default Header;
