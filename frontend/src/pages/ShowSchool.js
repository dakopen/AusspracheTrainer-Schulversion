import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom"; // Import useParams for route params
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { useNotification } from "../context/NotificationContext";
import { fetchSchool } from "../utils/api";
import SchoolTeachers from "../components/SchoolTeachers";

const ShowSchool = () => {
	const { schoolId } = useParams(); // Assuming the URL parameter is named shortId
	const [school, setSchool] = useState(null);
	const { authTokens } = useContext(AuthContext);
	const { addNotification } = useNotification();

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedSchool = await fetchSchool(authTokens, schoolId);
				setSchool(fetchedSchool);
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
			{school ? (
				<>
					<h2>School Details</h2>
					<p>
						<strong>Name:</strong> {school.name}
					</p>
					<p>
						<strong>Address:</strong> {school.address}
					</p>
					<p>
						<strong>Short ID:</strong> {school.short_id}
					</p>
					<SchoolTeachers />
				</>
			) : (
				<p>Loading school details...</p>
			)}
		</div>
	);
};

export default ShowSchool;
