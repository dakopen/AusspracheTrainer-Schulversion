import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import { fetchStudentsByCourse } from "../utils/api";

const CourseStudents = () => {
	const { courseId } = useParams();
	const [students, setStudents] = useState([]);
	const { authTokens } = useContext(AuthContext);
	const { addNotification } = useNotification();

    useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedStudents = await fetchStudentsByCourse(authTokens, courseId);
				setStudents(fetchedStudents);
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
