import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import CreateBulkStudents from "./CreateBulkStudents";

const CourseStudents = () => {
	const { courseId } = useParams();
	const [students, setStudents] = useState([]);
	const { authTokens } = useContext(AuthContext);
	const { ACCOUNT_BASE_URL } = useContext(UrlContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		const fetchStudents = async () => {
			const url = `${ACCOUNT_BASE_URL}/courses/${courseId}/students`; // Use the correct endpoint as per your API
			try {
				const response = await fetch(url, {
					headers: {
						Authorization: `Bearer ${String(authTokens.access)}`,
					},
				});

				if (!response.ok) {
					addNotification("Failed to fetch students.", "error");
					throw new Error("Failed to fetch students");
				}

				const data = await response.json();
				setStudents(data);
			} catch (error) {
				addNotification("Failed to fetch students.", "error");
				console.error("Error fetching students:", error.message);
			}
		};

		if (courseId) {
			fetchStudents();
		}
	}, [courseId, authTokens, ACCOUNT_BASE_URL, addNotification]);

	return (
		<div>
			<h3>Course Students: {students.length}</h3>
			{students.length > 0 ? (
				<ul>
					{students.map((student) => (
						<li key={student.id}>
							{student.username.substring(0, 10)}
						</li>
					))}
				</ul>
			) : (
				<p>Bisher keine Schüleraccounts hinzugefügt.</p>
			)}
			<CreateBulkStudents />
		</div>
	);
};

export default CourseStudents;
