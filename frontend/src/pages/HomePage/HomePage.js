import * as Sentry from "@sentry/react";
import React, { useState, useContext, useEffect, createRef } from "react";
import { useNotification } from "../../context/NotificationContext";
import { isStudyStudent, isTeacher, isNotLoggedIn, isAdmin } from "../../utils/RoleChecks";
import ToDo from "../../components/ToDo/ToDo";
import FinishedStudy from "../../components/FinishedStudy/FinishedStudy";
import AccountHealthCheck from "../../components/HealthCheck/AccountHealthCheck";
import AuthContext from "../../context/AuthContext";
import { faUser, faChalkboardTeacher, faSchool, faChevronDown, faDownload, faSignInAlt, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import StudyStudentLogin from "../StudyStudentLogin/StudyStudentLogin";

import { triggerAnalysis, generateUserReportPDF, fetchUserStudyStatus } from "../../utils/api";

import './TeacherHomePage.css';
import './HomePage.css';
import ToDoHealthCheck from "../../components/HealthCheck/ToDoHealthCheck";

const HomePage = () => {
	const { addNotification } = useNotification();
	const { user, authTokens } = useContext(AuthContext);

	const [isAdditionalInfoVisible, setIsAdditionalInfoVisible] = useState(false);
	const [activeInfoIndex, setActiveInfoIndex] = useState(1);
	const [status, setStatus] = useState({ finished_study: false, downloaded_report: false });

	useEffect(() => {
		const getStatus = async () => {
			if (!authTokens) return;
			try {
				if (isStudyStudent(user)) {
					const data = await fetchUserStudyStatus(authTokens);
					setStatus(data);
				}
			} catch (error) {
				Sentry.captureException(error);
			}
		};

		getStatus();
	}, [authTokens]);

	useEffect(() => {
		if (isNotLoggedIn(user)) {
			const form = document.getElementById("schoolForm");

			const handleSubmit = async (e) => {
				e.preventDefault();

				const response = await fetch("https://formspree.io/f/mrgnybzv", {
					method: 'POST',
					body: new FormData(form),
					headers: {
						'Accept': 'application/json'
					}
				});

				if (response.ok) {
					form.reset();
					alert("Erfolg! Ihre Nachricht wurde gesendet.");
				} else {
					alert("Es gab einen Fehler beim Senden Ihrer Nachricht. Bitte versuchen Sie es später erneut.");
				}
			};

			form.addEventListener('submit', handleSubmit);
			return () => {
				form.removeEventListener('submit', handleSubmit);
			};
		}
	}, [user]);

	const handleDropdownClick = () => {
		setIsAdditionalInfoVisible(prevState => !prevState);
	};

	const handleIconClick = (index) => {
		setActiveInfoIndex(index);
	};

	const getIconClass = (index) => {
		return activeInfoIndex === index ? 'icon' : 'icon icon-inactive';
	};





	return (
		<div className="App">
			{isNotLoggedIn(user) &&
				<>
					<StudyStudentLogin />
					<div className="center-container-no-background">
						<div className="dropdown-files-container">
							<div className="dropdown-files" onClick={handleDropdownClick}>
								<span className="line-files"></span>
								<span className="text-files">Weitere Informationen</span>
								<FontAwesomeIcon icon={faChevronDown} className={`dropdown-icon-files ${isAdditionalInfoVisible ? 'dropdown-rotate' : ''}`} />
								<span className="line-files"></span>
							</div>
						</div>
						<div className={`additional-information ${isAdditionalInfoVisible ? '' : 'inactive'}`}>
							<small>Infos für...</small>
							<div className="icon-container" id="icon-wrapper-addinfo">
								<div className="icon-wrapper" onClick={() => handleIconClick(1)}>
									<FontAwesomeIcon icon={faUser} className={getIconClass(1)} />
									<p>Schüler:innen & Eltern</p>
								</div>
								<div className="icon-wrapper" onClick={() => handleIconClick(2)}>
									<FontAwesomeIcon icon={faChalkboardTeacher} className={getIconClass(2)} />
									<p>Lehrer:innen</p>
								</div>
								<div className="icon-wrapper" onClick={() => handleIconClick(3)}>
									<FontAwesomeIcon icon={faSchool} className={getIconClass(3)} />
									<p>Schulen</p>
								</div>
							</div>
							<div id="infoText" className="info-text">
								<div id="additional-info1" className={`text ${activeInfoIndex === 1 ? '' : 'inactive'}`}>
									<p>Als Schüler:in kannst du dich oben einloggen, um an der Studie teilzunehmen. Bitte gib deinen persönlichen Code ein, um fortzufahren. Den Code erhälst du von deiner Lehrkraft.</p>
									<span><FontAwesomeIcon icon={faDownload} /><a href="https://www.google.com/search?q=Link+wird+sp%C3%A4ter+aktualisiert" target="_blank" rel="noopener noreferrer"> Teilnehmendenaufklärung.pdf</a></span><br />
									<span><FontAwesomeIcon icon={faDownload} /><a href="https://www.google.com/search?q=Link+wird+sp%C3%A4ter+aktualisiert" target="_blank" rel="noopener noreferrer"> Einwilligungserklärung.pdf</a></span>
								</div>
								<div id="additional-info2" className={`text ${activeInfoIndex === 2 ? '' : 'inactive'}`}>
									<p>Als Lehrer:in können Sie sich <Link to="/rolelogin"> hier <FontAwesomeIcon icon={faSignInAlt} /></Link> &nbsp;einloggen, um die Studie zu verwalten.</p>
									<p>Wenn Sie Fragen oder Anregungen haben, melden Sie sich gerne bei mir unter &nbsp; <a href="mailto:kontakt@aussprachetrainer.org"><FontAwesomeIcon icon={faEnvelope} /> kontakt@aussprachetrainer.org</a>.</p>
								</div>
								<div id="additional-info3" className={`text ${activeInfoIndex === 3 ? '' : 'inactive'} school-form`}>
									<p>Wenn deine Schule von der Studie gehört hat, und über eine Teilnahme an der Studie nachdenkt, kannst du dieses unverbindliche Kontaktformular verwenden. Gerne können wir einen Videocall ausmachen.</p>
									<form action="https://formspree.io/f/mrgnybzv" method="post" id="schoolForm">
										<label htmlFor="name" className="form-required">Ansprechperson:</label><br />
										<input type="text" id="name" name="name" placeholder="Vor- und Nachname" required /><br />
										<label htmlFor="schoolName" className="form-required">Schulname:</label><br />
										<input type="text" id="schoolName" name="schoolName" placeholder="Schulname" required /><br />
										<label htmlFor="schoolLocation" className="form-required">Schulort:</label><br />
										<input type="text" id="schoolLocation" name="schoolLocation" placeholder="Ort" required /><br />
										<label htmlFor="email" className="form-required">Email Adresse:</label><br />
										<input type="email" id="email" name="email" placeholder="kontakt@schulname.edu" required /><br />
										<label htmlFor="message">Nachricht (optional):</label><br />
										<textarea id="message" name="message"></textarea><br />
										<input type="submit" value="Weitere Informationen erhalten" />
									</form>
								</div>
							</div>
						</div>
					</div>
				</>
			}
			{isStudyStudent(user) &&
				<>
					<h1>AusspracheTrainer Studie</h1>

					{!status.finished_study && <ToDo />}
					{status.finished_study && <FinishedStudy reportSent={status.downloaded_report} status={status} />}
				</>
			}
			{isTeacher(user) &&
				<>
					<h1>AusspracheTrainer Studie</h1>
					<div className="teacher-homepage-container">
						<Link to="/courses" className="card-link">
							<div className="homepage-card">
								<h3>Kurse</h3>
								<p>Erstellen und verwalten Sie Ihre Kurse.</p>
							</div>
						</Link>
						<div className="homepage-card">
							<h3>Downloads</h3>
							<p>Hier kommen Links zu den Dokumenten wie Einverständniserklärung und Teilnehmeraufklärung hin.</p>
						</div>
						<div className="homepage-card">
							<h3>Kontakt</h3>
							<p>Bei Fragen, Anregungen, technischen Problemen und sonstigen Anliegen schreiben
								Sie mir bitte eine Mail an <a href="mailto:daniel.roland.busch@gmail.com">daniel.roland.busch@gmail.com</a>.
								<br /><br />
								<small>(Eine Mail an kontakt@aussprachetrainer.org ist auch in Ordnung, allerdings kann es sein, dass ich da länger brauche, um zu antworten.)</small>
							</p>
						</div>
					</div>
				</>
			}
			{isAdmin(user) &&
				<>
					<AccountHealthCheck></AccountHealthCheck>
					<ToDoHealthCheck></ToDoHealthCheck>
				</>
			}
		</div>
	);
};

export default HomePage;
