import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import { fetchTeachersBySchool } from "../utils/api";

const SchoolTeachers = () => {
	const { schoolId } = useParams();
	const [teachers, setTeachers] = useState([]);
	const { authTokens } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedTeachers = await fetchTeachersBySchool(
					authTokens,
					schoolId
				);
				setTeachers(fetchedTeachers);
			} catch (error) {
				console.error("Error loading data:", error);
			}
		};
		if (schoolId) {
			loadData();
		}
	}, [schoolId, authTokens]);

	return (
		<div>
			<h3>School teachers: {teachers.length}</h3>
			{teachers.length > 0 ? (
				<ul>
					{teachers.map((teacher) => (
						<li key={teacher.id}>{teacher.username}</li>
					))}
				</ul>
			) : (
				<p>Bisher keine Lehrer hinzugefügt.</p>
			)}
		</div>
	);
};

export default SchoolTeachers;
