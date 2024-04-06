const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust this to your actual API base URL
const ACCOUNT_BASE_URL = "accounts";

export const fetchSchools = async (authTokens) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/${ACCOUNT_BASE_URL}/schools/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch schools");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching schools:", error);
		throw error;
	}
};

export const fetchCourses = async (authTokens) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/${ACCOUNT_BASE_URL}/courses/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch schools");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching schools:", error);
		throw error;
	}
};
