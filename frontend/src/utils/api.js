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

export const fetchCourse = async (authTokens, courseId) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/${ACCOUNT_BASE_URL}/courses/${courseId}/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch course");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching course:", error);
		throw error;
	}
};

export const fetchSchool = async (authTokens, schoolId) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/${ACCOUNT_BASE_URL}/schools/${schoolId}/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch school");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching school:", error);
		throw error;
	}
};

export const fetchStudentsByCourse = async (authTokens, courseId) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/${ACCOUNT_BASE_URL}/courses/${courseId}/students/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch students");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching students:", error);
		throw error;
	}
};

export const fetchTeachersBySchool = async (authTokens, schoolId) => {
	try {
		const response = await fetch(
			`${API_BASE_URL}/${ACCOUNT_BASE_URL}/schools/${schoolId}/teachers/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch teachers");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching teachers:", error);
		throw error;
	}
};
