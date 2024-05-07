import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../../context/AuthContext.js";
import { fetchCourses } from "../../utils/api.js";
import CreateCourse from "../../components/CreateCourse.js";
import { isTeacher } from "../../utils/RoleChecks.js";
import { Link } from "react-router-dom";
import "./Courses.css";
import "./CreateCourse.css"

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
		<div className="course-container">
			{courses.map((course) => (
				<Link to={`/courses/${course.id}`} key={course.id} className="course-card">
					<div>
						<h4>{course.name}</h4>
						<p>{course.language}</p>
						<p>{course.teacher}</p>
						<small>KURS ID: {course.id}</small>
					</div>
				</Link>
			))}
			{isTeacher(user) && <CreateCourse setCourses={setCourses} />}
		</div>
	);
};

export default Courses;
