import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import { fetchStudentsByCourse } from "../utils/api";
import CreateBulkStudents from "./CreateBulkStudents";

const CourseStudents = () => {
	const { courseId } = useParams();
	const [students, setStudents] = useState([]);
	const { authTokens } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		if (courseId) {
			refreshCourseStudents();
		}
	}, [courseId, authTokens]);

	const refreshCourseStudents = async () => {
		try {
			const fetchedStudents = await fetchStudentsByCourse(
				authTokens,
				courseId
			);
			setStudents(fetchedStudents);
		} catch (error) {
			console.error("Error refreshing data:", error);
		}
	};

	return (
		<div>
			<h4>Schüler:innen Accounts: {students.length}</h4>
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
			<CreateBulkStudents refreshStudents={refreshCourseStudents} />
		</div>
	);
};

export default CourseStudents;
