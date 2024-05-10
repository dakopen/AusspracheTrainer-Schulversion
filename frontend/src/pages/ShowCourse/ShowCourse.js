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


	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedCourse = await fetchCourse(authTokens, courseId);
				setCourse(fetchedCourse);
				setName(fetchedCourse.name);
				setGrade(fetchedCourse.grade);
				setFinalTestActivated(fetchedCourse.activate_final_test);
			} catch (error) {
				console.error("Error loading course data:", error);
			}
		};

		if (courseId) {
			loadData();
		}
	}, [courseId, authTokens]);

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
			addNotification("Study status updated successfully", "success");
		} catch (error) {
			addNotification("Failed to update study status", "error");
			console.error("Error updating study status:", error);
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
					<h2 className="show-course-header">Details: {course.name}</h2>
					<div className="show-course-detail">
						<strong>Kursname:</strong>
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
					<button className="show-course-button" onClick={toggleStudyStarted}>
						{course.study_started ? "Mark as Not Started" : "Mark as Started"}
					</button>
					<p><strong>Sprache:</strong> {course.language === 1 ? "Englisch" : "Französisch"}</p>
					<CourseStudents />
					{course.study_started &&
						<>
							<CourseToDoDates final_test_activated={finalTestActivated} />
							<button className="show-course-button" onClick={toggleFinalTestActivation}>
								{course.activate_final_test ? "Finalen Test deaktivieren" : "Finalen Test aktivieren"}
							</button>
						</>}
					<div className="course-debug-information">
						<small>
							<p>
								<strong>Kurs-ID:</strong> {course.id}
								{"  -  "}
								<strong>Lehrer-ID:</strong> {course.teacher}
								{"  -  "}
								<strong>Erstellt am:</strong> {new Date(course.created_at).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}
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
