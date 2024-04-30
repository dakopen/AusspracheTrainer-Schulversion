import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import CourseStudents from "../components/CourseStudents";
import { fetchCourse, updateCourseField } from "../utils/api"; // updateCourseField to handle field-specific updates

const ShowCourse = () => {
	const { courseId } = useParams();
	const [course, setCourse] = useState(null);
	const [editName, setEditName] = useState(false); // To toggle name editing
	const [name, setName] = useState(""); // For handling the name input
	const { authTokens } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedCourse = await fetchCourse(authTokens, courseId);
				setCourse(fetchedCourse);
				setName(fetchedCourse.name);
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

	return (
		<div>
			{course ? (
				<>
					<h2>Course Details</h2>
					<div>
						<strong>Name:</strong>
						{editName ? (
							<input type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={handleNameChange} autoFocus />
						) : (
							<>
								{course.name}
								<button onClick={() => setEditName(true)}>Edit</button>
							</>
						)}
					</div>
					<button onClick={toggleStudyStarted}>
						{course.study_started ? "Mark as Not Started" : "Mark as Started"}
					</button>
					<p><strong>Language:</strong> {course.language}</p>
					<p><strong>Teacher:</strong> {course.teacher}</p>
					<CourseStudents />
				</>
			) : (
				<p>Loading course details...</p>
			)}
		</div>
	);
};

export default ShowCourse;
