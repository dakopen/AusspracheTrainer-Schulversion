import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../context/AuthContext";
import { UrlContext } from "../context/UrlContext";
import { fetchSchools } from "../utils/api";
import CreateSchool from "../components/CreateSchool.js";
import { Link } from "react-router-dom";

const Schools = () => {
	const [schools, setSchools] = useState([]);
	const { authTokens } = useContext(AuthContext);
	const { BASE_URL, ACCOUNT_BASE_URL } = useContext(UrlContext);

	useEffect(() => {
		const loadData = async () => {
			try {
				const fetchedSchools = await fetchSchools(authTokens);
				setSchools(fetchedSchools);
			} catch (error) {
				console.error("Error loading data:", error);
			}
		};

		loadData();
	}, [authTokens]);

	return (
		<>
			<div>
				{schools.map((school) => (
					<Link to={`/schools/${school.id}`} key={school.id}>
						<p>
							{school.name} - {school.address} - ID:{" "}
							{school.short_id}
						</p>
					</Link>
				))}
			</div>
			<CreateSchool />
		</>
	);
};

export default Schools;
