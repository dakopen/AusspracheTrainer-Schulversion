import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { fetchCourses } from "../utils/api";
import CreateCourse from "./CreateCourse.js";
import { isTeacher } from "../utils/RoleChecks";
import { Link } from "react-router-dom";

const Courses = () => {
	const { authTokens, user } = useContext(AuthContext);
	const [courses, setCourses] = useState([]);

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedCourses = await fetchCourses(authTokens);
				setCourses(fetchedCourses);
			} catch (error) {
				console.error("Error loading data:", error);
			}
		};

		loadData();
	}, [authTokens]);

	return (
		<div>
			{courses.map((course) => {
				return (
					<Link to={`/courses/${course.id}`} key={course.id}>
						<p>
							{course.name} - {course.language} - {course.teacher}{" "}
							- KURS ID: {course.id}
						</p>
					</Link>
				);
			})}
			{isTeacher(user) && <CreateCourse setCourses={setCourses} />}
		</div>
	);
};

export default Courses;
