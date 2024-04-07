import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // Import useParams if you're using React Router for route params
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";

const ShowCourse = () => {
	const { courseId } = useParams(); // Get courseId from the URL if using React Router
	const [course, setCourse] = useState(null);
	const { authTokens } = useContext(AuthContext);
	const { ACCOUNT_BASE_URL } = useContext(UrlContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		const fetchCourse = async () => {
			const url = `${ACCOUNT_BASE_URL}/courses/${courseId}/`; // Adjust the URL based on your actual API endpoint
			try {
				const response = await fetch(url, {
					headers: {
						Authorization: "Bearer " + String(authTokens.access),
					},
				});

				if (!response.ok) {
					addNotification("Course data fetch failed.", "error");
					throw new Error("Course data fetch failed.");
				}

				const data = await response.json();
				setCourse(data);
			} catch (error) {
				addNotification("Course data fetch failed.", "error");
				console.error("Error fetching course:", error.message);
			}
		};

		if (courseId) {
			fetchCourse();
		}
	}, [courseId, authTokens, ACCOUNT_BASE_URL, addNotification]);

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
					{/* Add more details as needed */}
				</>
			) : (
				<p>Loading course details...</p>
			)}
		</div>
	);
};

export default ShowCourse;
