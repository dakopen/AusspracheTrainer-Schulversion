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
			{courses.sort((a, b) => a.id - b.id).map((course) => (
				<Link to={`/courses/${course.id}`} key={course.id} className={`course-card ${course.demo && "course-demo"} `}>
					<div>
						<h4>{course.name} {course.demo && "[DEMO]"}</h4>
						<p>{course.language === 1 ? "Englisch" : "Französisch"}</p>
						<p>{course.number_of_students} Schüler</p>
						<p>{course.study_started ? "Kurs am " + new Date(course.scheduled_study_start ? course.scheduled_study_start : course.start_date).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric' }) + " aktiviert" : "Kurs noch nicht aktiviert"}</p>
						<small>Kurs ID: {course.id}, erstellt am {new Date(course.created_at).toLocaleString([], { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' })}</small>
					</div>
				</Link>
			))}
			{isTeacher(user) && <CreateCourse setCourses={setCourses} />}
		</div>
	);
};

export default Courses;
