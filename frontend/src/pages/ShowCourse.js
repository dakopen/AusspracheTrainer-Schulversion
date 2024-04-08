import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // Import useParams if you're using React Router for route params
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import CourseStudents from "../components/CourseStudents";
import { fetchCourse } from "../utils/api";

const ShowCourse = () => {
	const { courseId } = useParams(); // Get courseId from the URL if using React Router
	const [course, setCourse] = useState(null);
	const { authTokens } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedCourse = await fetchCourse(authTokens, courseId);
				setCourse(fetchedCourse);
			} catch (error) {
				console.error("Error loading data:", error);
			}
		};
		if (courseId) {
			loadData();
		}
	}, [courseId, authTokens]);

	return (
		<div>
			{course ? (
				<>
					<h2>Course Details</h2>
					<p>
						<strong>Name:</strong> {course.name}
					</p>
					<p>
						<strong>Language:</strong> {course.language}
					</p>
					<p>
						<strong>Teacher:</strong> {course.teacher}
					</p>
					<CourseStudents />
				</>
			) : (
				<p>Loading course details...</p>
			)}
		</div>
	);
};

export default ShowCourse;
