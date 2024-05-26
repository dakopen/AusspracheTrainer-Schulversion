import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import { fetchStudentsByCourse, fetchChangedUsernamesByCourse } from "../utils/api";
import CreateBulkStudents from "./CreateBulkStudents";

const CourseStudents = () => {
	const { courseId } = useParams();
	const [students, setStudents] = useState([]);
	const { authTokens } = useContext(AuthContext);
	const { addNotification } = useNotification();

	const [changedStudentNames, setChangedStudentNames] = useState([]);

	useEffect(() => {
		if (courseId) {
			refreshCourseStudents();
			refreshChangedCourseStudentNames();
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

	const refreshChangedCourseStudentNames = async () => {
		try {
			const fetchedStudents = await fetchChangedUsernamesByCourse(
				authTokens,
				courseId
			);
			setChangedStudentNames(fetchedStudents);
		} catch (error) {
			console.error("Error refreshing data:", error);
		}
	}

	return (
		<div>
			<h4>Schüler:innen Accounts: {students.length}</h4>
			{students.length > 0 ? (
				<>
					<ul>
						{students.map((student) => (
							<li key={student.id}>
								{student.username.substring(0, 10)}
							</li>
						))}
					</ul>
					{changedStudentNames.length > 0 &&
						<>
							<h4> Geänderte Benutzernamen:</h4>
							<small>Schüler:innen haben die Möglichkeit, ihren Benutzernamen zu ändern. Falls der neue Benutzername vergessen wurde und sich an den alten noch erinnert wird, können Sie mit dieser Liste helfen.</small>
							<ul>
								{changedStudentNames.map((student) => (
									<li key={student.id}>
										{student.old_username.substring(0, 10)} {"-->"} {student.new_username.substring(0, 10)}
									</li>

								))}
							</ul>
						</>
					}
				</>
			) : (
				<p>Bisher keine Schüleraccounts hinzugefügt.</p>
			)
			}
			<CreateBulkStudents refreshStudents={refreshCourseStudents} />
		</div >
	);
};

export default CourseStudents;
