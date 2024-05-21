import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../../context/AuthContext";
import { useNotification } from "../../context/NotificationContext";
import CourseStudents from "../../components/CourseStudents";
import { fetchCourse, updateCourseField } from "../../utils/api";
import CourseToDoDates from "../../components/CourseToDoDates";
import './ShowCourse.css';
import './CreateBulkStudents.css'
import './CourseToDoDates.css'
import './SentenceDisplay.css'

const ShowCourse = () => {
	const { courseId } = useParams();
	const [course, setCourse] = useState(null);
	const [editName, setEditName] = useState(false);
	const [name, setName] = useState("");
	const [editGrade, setEditGrade] = useState(false);
	const [grade, setGrade] = useState("");
	const [finalTestActivated, setFinalTestActivated] = useState(false);
	const { authTokens } = useContext(AuthContext);
	const { addNotification } = useNotification();

	const [scheduledStudyStart, setScheduledStudyStart] = useState("");
	const [scheduledFinalTest, setScheduledFinalTest] = useState("");
	const [isDemo, setIsDemo] = useState(false);


	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedCourse = await fetchCourse(authTokens, courseId);
				setCourse(fetchedCourse);
				setName(fetchedCourse.name);
				setGrade(fetchedCourse.grade);
				setFinalTestActivated(fetchedCourse.activate_final_test);
				console.log(fetchedCourse);
				setScheduledStudyStart(fetchedCourse.scheduled_study_start || "");
				setScheduledFinalTest(fetchedCourse.scheduled_final_test || "");
				setIsDemo(fetchedCourse.demo || false);
			} catch (error) {
				console.error("Error loading course data:", error);
			}
		};

		if (courseId) {
			loadData();
		}
	}, [courseId, authTokens]);

	const formatDate = (dateString) => {
		if (!dateString) return "";
		const date = new Date(dateString);
		return new Intl.DateTimeFormat('en-CA').format(date); // 'en-CA' uses the YYYY-MM-DD format which is required by input type="date"
	};

	const handleNameChange = async () => {
		try {
			await updateCourseField(authTokens, courseId, { name });
			setCourse(prev => ({ ...prev, name }));
			setEditName(false);
			addNotification("Course name updated successfully", "success");
		} catch (error) {
			addNotification("Failed to update course name", "error");
			console.error("Error updating course name:", error);
		}
	};

	const updateScheduledDate = async (field, value) => {
		try {
			await updateCourseField(authTokens, courseId, { [field]: value });
			setCourse(prev => ({ ...prev, [field]: value }));
			addNotification(`${field} date updated successfully`, "success");
			let startfield = "study_started";

			if (field === 'scheduled_final_test') {
				startfield = "activate_final_test";
				setFinalTestActivated(true);
			}

			const updatedCourse = await updateCourseField(authTokens, courseId, { [startfield]: true, [field]: value });
			setCourse(updatedCourse);

		} catch (error) {
			addNotification(`Failed to update ${field} date`, "error");
			console.error(`Error updating ${field} date:`, error);
		}
	};

	const handleGradeChange = async () => {
		try {
			await updateCourseField(authTokens, courseId, { grade });
			setCourse(prev => ({ ...prev, grade }));
			setEditGrade(false);
			addNotification("Course grade updated successfully", "success");
		} catch (error) {
			addNotification("Failed to update course grade", "error");
			console.error("Error updating course grade:", error);
		}
	};

	const toggleStudyStarted = async () => {
		try {
			const studyStarted = !course.study_started;
			const updatedCourse = await updateCourseField(authTokens, courseId, { study_started: studyStarted });
			setCourse(updatedCourse);
			setFinalTestActivated(false);
			addNotification("Study status updated successfully", "success");
		} catch (error) {
			addNotification("Failed to update study status", "error");
			console.error("Error updating study status:", error);
		}
	};

	const toggleDemoStatus = async () => {
		const newDemoStatus = !isDemo;
		try {
			const updatedCourse = await updateCourseField(authTokens, course.id, { demo: newDemoStatus });
			setIsDemo(updatedCourse.demo);
			addNotification(`Demo Status erfolgreich geändert`, "success");
		} catch (error) {
			console.error('Failed to update demo status:', error);
			addNotification('Demo Status Änderung war nicht erfolgreich.', 'error');
		}
	};

	const toggleFinalTestActivation = async () => {
		try {
			const updatedCourse = await updateCourseField(authTokens, courseId, { activate_final_test: !finalTestActivated });
			setCourse(updatedCourse);
			setFinalTestActivated(!finalTestActivated);

			addNotification("Final Test activated successfully", "success");
		} catch (error) {
			addNotification("Failed to activate the final test", "error");
			console.error("Error updating study status:", error);
		}
	};

	return (
		<div className="show-course-container">
			{course ? (
				<>
					<h2 className="show-course-header">Details: {course.name} {isDemo && "[DEMO]"}</h2>
					<div className="show-course-detail">
						<strong>Name:</strong>
						{editName ? (
							<input type="text" className="show-course-input" value={name} onChange={(e) => setName(e.target.value)} onBlur={handleNameChange} autoFocus />
						) : (
							<>
								{course.name}
								<button className="show-course-button" onClick={() => setEditName(true)}>Edit</button>
							</>
						)}
					</div>
					<div className="show-course-detail">
						<strong>Stufe:</strong>
						{editGrade ? (
							<select className="show-course-select" value={grade} onChange={(e) => setGrade(e.target.value)} onBlur={handleGradeChange}>
								<option value={5}>5. Klasse</option>
								<option value={6}>6. Klasse</option>
								<option value={7}>7. Klasse</option>
								<option value={8}>8. Klasse</option>
								<option value={9}>9. Klasse</option>
								<option value={10}>10. Klasse</option>
								<option value={11}>11. Klasse</option>
								<option value={12}>12. Klasse</option>
								<option value={13}>13. Klasse</option>
							</select>
						) : (
							<>
								{course.grade}
								<button className="show-course-button" onClick={() => setEditGrade(true)}>Edit</button>
							</>
						)}
					</div>

					<p><strong>Sprache:</strong> {course.language === 1 ? "Englisch" : "Französisch"}</p>
					<CourseStudents />
					<br></br>

					<div className="show-course-detail">
						<strong>Geplantes Startdatum:</strong>


						{console.log(scheduledStudyStart, "scheduledStudyStart")}
						{!course.study_started &&
							<>
								<input type="date" className="show-course-input show-course-input-date" value={formatDate(scheduledStudyStart)} onChange={(e) => setScheduledStudyStart(e.target.value)} onBlur={() => updateScheduledDate('scheduled_study_start', scheduledStudyStart)} />
								<p> oder </p>
							</>
						}
						<button className="show-course-button" onClick={toggleStudyStarted} title={course.study_started ? "Klicken, um den Studienstart zurückzunehmen und neu zu planen. Alle bereits erledigten Trainings werden gespeichert." : "Studie direkt starten, sodass Schüler:innen direkt anfangen können mit dem Anfangstest."}>
							{course.study_started ? "Studienstart zurücknehmen" : "heute starten"}
						</button>
					</div>
					{course.study_started &&
						<div className="show-course-detail">
							<strong>Geplanter finaler Test:</strong>

							{!course.activate_final_test &&
								<>
									<input type="date" className="show-course-input show-course-input-date" value={formatDate(scheduledFinalTest)} onChange={(e) => setScheduledFinalTest(e.target.value)} onBlur={() => updateScheduledDate('scheduled_final_test', scheduledFinalTest)} />
									<p> oder </p>
								</>
							}
							<button className="show-course-button" onClick={toggleFinalTestActivation} title={course.activate_final_test ? "Klicken, um den finalen Test zurückzunehmen und neu zu planen. Dadurch kann keiner den finalen Test sehen, bevor er aktiviert ist." : "Klicken, um den finalen Test heute zu aktivieren, sodass er direkt bei den Schülerinnen erscheint. Achtung, er erscheint vor allen Trainingsaufgaben!!"}>
								{course.activate_final_test ? "Finalen Test zurücknehmen" : "heute starten"}

							</button>
						</div>
					}
					{course.study_started &&
						<>
							<CourseToDoDates final_test_activated={finalTestActivated} />
							<br></br>
							<button className="show-course-button" onClick={toggleFinalTestActivation} title={course.activate_final_test ? "Klicken, um den finalen Test zurückzunehmen und neu zu planen. Dadurch kann keiner den finalen Test sehen, bevor er aktiviert ist." : "Klicken, um den finalen Test heute zu aktivieren, sodass er direkt bei den Schülerinnen erscheint. Achtung, er erscheint vor allen Trainingsaufgaben!!"}>
								{course.activate_final_test ? "Finalen Test zurücknehmen" : "Finalen Test heute starten"}
							</button>
						</>}

					<br></br>
					<br></br>
					<hr></hr>
					<p>Dieser Kurs ist ein {isDemo ? "Demo-" : "regulärer "}Kurs. Das heißt, er wird in der Auswertung {isDemo && <b>nicht</b>} berücksichtigt. Hier können Sie den Kurs umschalten:</p>
					<button className="show-course-button" onClick={toggleDemoStatus}>
						{isDemo ? 'Kurs umschalten zu regulärem Kurs (keine Demo)' : 'Kurs umschalten zum Demo Kurs (nur für Testzwecke)'}
					</button>

					<div className="course-debug-information">
						<small>
							<p>
								<strong>Kurs-ID:</strong> {course.id}
								{"  -  "}
								<strong>Lehrer-ID:</strong> {course.teacher}
								{"  -  "}
								<strong>Erstellt am:</strong> {new Date(course.created_at).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
								{"  -  "}
								<strong>Kursart:</strong> {isDemo ? "Demo" : "regulärer Kurs"}
							</p>
						</small>
					</div>

				</>
			) : (
				<p>Lädt...</p>
			)}
		</div>
	);
};


export default ShowCourse;
