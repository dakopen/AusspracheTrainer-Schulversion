import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { fetchSchools } from "../utils/api";

const CreateAnyRole = () => {
	const [email, setEmail] = useState("");
	const [selectedSchool, setSelectedSchool] = useState("");
	const [selectedRole, setSelectedRole] = useState("");
	const [schools, setSchools] = useState([]);
	const roles = ["Teacher", "Secretary", "Admin"]; // change later

	const { authTokens } = useContext(AuthContext);

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

	const handleSubmit = async (event) => {
		event.preventDefault();
		const url = "http://127.0.0.1:8000/accounts/create-any-role/";
		const data = JSON.stringify({
			username: email,
			school: selectedSchool,
			role: selectedRole,
		});

		try {
			const response = await fetch(url, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
				},
				body: data,
			});

			if (response.status === 201) {
				alert(
					"User created successfully. A link has been sent to their email to set a password."
				);
			} else {
				const responseData = await response.json();
				throw new Error(
					responseData.detail ||
						"An error occurred while creating the user."
				);
			}
		} catch (error) {
			alert(error.message);
			console.error(error);
		}
	};
	return (
		<form onSubmit={handleSubmit}>
			<label>
				Email:
				<input
					type="email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
			</label>
			<label>
				School:
				<select
					value={selectedSchool}
					onChange={(e) => setSelectedSchool(e.target.value)}
					required
				>
					<option value="">Select a School</option>
					{schools.map((school) => (
						<option key={school.id} value={school.id}>
							{school.name}
						</option>
					))}
				</select>
			</label>
			<label>
				Role:
				<select
					value={selectedRole}
					onChange={(e) => setSelectedRole(e.target.value)}
					required
				>
					<option value="">Select a Role</option>
					{roles.map((role) => (
						<option key={role} value={roles.indexOf(role) + 1}>
							{role}
						</option>
					))}
				</select>
			</label>
			<button type="submit">Create User</button>
		</form>
	);
};

export default CreateAnyRole;
