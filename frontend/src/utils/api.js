//const API_BASE_URL = "http://127.0.0.1:8000"; // Adjust this to your actual API base URL


//const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000`;
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// const API_BASE_URL = "https://tapir-perfect-thankfully.ngrok-free.app";
const ACCOUNT_BASE_URL = `${API_BASE_URL}/accounts`;
const STUDYDATA_BASE_URL = `${API_BASE_URL}/studydata`;
const TODO_BASE_URL = `${API_BASE_URL}/todo`;

export const fetchSchools = async (authTokens) => {
	try {
		const response = await fetch(
			`${ACCOUNT_BASE_URL}/schools/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",
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
			`${ACCOUNT_BASE_URL}/courses/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",
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
			`${ACCOUNT_BASE_URL}/courses/${courseId}/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",
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
			`${ACCOUNT_BASE_URL}/schools/${schoolId}/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

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
			`${ACCOUNT_BASE_URL}/courses/${courseId}/students/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

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

export const fetchChangedUsernamesByCourse = async (authTokens, courseId) => {
	try {
		const response = await fetch(
			`${ACCOUNT_BASE_URL}/courses/${courseId}/changed_usernames/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch changed usernames");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching changed usernames:", error);
		throw error;
	}
};


export const updateCourseField = async (authTokens, courseId, data) => {
	try {
		const response = await fetch(
			`${ACCOUNT_BASE_URL}/courses/${courseId}/update`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

				},
				body: JSON.stringify(data)
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error("Failed to update course: " + errorData.detail || "Server responded with an error");
		}

		const updatedData = await response.json();
		return updatedData;
	} catch (error) {
		console.error("Error updating course:", error);
		throw error;
	}
};



export const fetchTeachersBySchool = async (authTokens, schoolId) => {
	try {
		const response = await fetch(
			`${ACCOUNT_BASE_URL}/schools/${schoolId}/teachers/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

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

export const fetchToDoDates = async (authTokens, courseId) => {
	try {
		const response = await fetch(
			`${TODO_BASE_URL}/courses/${courseId}/todo-dates/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch ToDo dates");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching ToDo dates:", error);
		throw error;
	}
};

export const updateToDoDates = async (authTokens, courseId, standard_todo, dateData) => {
	try {
		const response = await fetch(
			`${TODO_BASE_URL}/courses/${courseId}/todo-dates/${standard_todo}/update`,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${authTokens.access}`,
					"ngrok-skip-browser-warning": "true",

				},
				body: JSON.stringify({
					activation_date: dateData.activation_date,
					due_date: dateData.due_date
				})
			}
		);

		if (!response.ok) {
			const errorData = await response.json();
			throw new Error("Failed to update ToDo dates: " + (errorData.detail || "Server responded with an error"));
		}

		const updatedData = await response.json();
		return updatedData;
	} catch (error) {
		console.error("Error updating ToDo dates:", error);
		throw error;
	}
};




export const fetchLowestPriorityUserToDo = async (authTokens) => {
	try {
		const response = await fetch(`${TODO_BASE_URL}/`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(authTokens.access),
				"ngrok-skip-browser-warning": "true",

			},
		});

		if (!response.ok) {
			throw new Error("Failed to fetch user ToDo");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user ToDo:", error);
		throw error;
	}
};

export const fetchSentences = async (authTokens) => {
	try {
		const response = await fetch(
			`${STUDYDATA_BASE_URL}/sentences/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch sentences");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching sentences:", error);
		throw error;
	}
};

export const createSentences = async (sentences, authTokens) => {
	try {
		const response = await fetch(
			`${STUDYDATA_BASE_URL}/sentences/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

				},
				body: JSON.stringify(sentences),
			}
		);

		if (!response.ok) {
			throw new Error("Failed to create sentences");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error creating sentences:", error);
		throw error;
	}
};



export const updateSentence = async (sentence, id, authTokens) => {
	try {
		const response = await fetch(
			`${STUDYDATA_BASE_URL}/sentences/${id}/`,
			{
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

				},
				body: JSON.stringify(sentence),
			}
		);

		if (!response.ok) {
			throw new Error("Failed to update sentence");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error updating sentence:", error);
		throw error;
	}
};

export const deleteSentence = async (id, authTokens) => {
	try {
		const response = await fetch(
			`${STUDYDATA_BASE_URL}/sentences/${id}/`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

				},

			}
		);

		if (!response.ok) {
			throw new Error("Failed to delete sentence");
		}
	} catch (error) {
		console.error("Error deleting sentence:", error);
		throw error;
	}
};


export const completeStandardTodo = async (standard_todo, authTokens) => {
	try {
		const response = await fetch(
			`${TODO_BASE_URL}/complete`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",

				},
				body: JSON.stringify({ standard_todo })
			}
		);

		if (!response.ok) {
			throw new Error("Failed to complete the tutorial");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error completing tutorial:", error);
		throw error;
	}
};

export const fetchSentencesByCourseAndLocation = async (startLocation, endLocation, authTokens, courseId = null) => {
	try {
		// Construct the URL with query parameters for GET request
		const url = new URL(`${STUDYDATA_BASE_URL}/course-assignments/`);
		if (courseId) {
			url.searchParams.append('course_id', courseId);
		}
		url.searchParams.append('start_location', startLocation);
		url.searchParams.append('end_location', endLocation);

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(authTokens.access),
				"ngrok-skip-browser-warning": "true",

			}
		});

		if (!response.ok) {
			throw new Error("Failed to retrieve sentences");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching sentences:", error);
		throw error;
	}
};


export const checkTaskStatus = async (id, authTokens) => {
	try {
		const response = await fetch(`${STUDYDATA_BASE_URL}/task-status/${id}/`, {
			headers: {
				Authorization: "Bearer " + authTokens.access,
				"ngrok-skip-browser-warning": "true",

			},
		});
		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching task status:", error);
		return { status: "FAILURE" };
	}
};

export const triggerAnalysis = async (authTokens) => {
	try {
		const response = await fetch(`${STUDYDATA_BASE_URL}/trigger-audio-analysis/`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${authTokens.access}`,
				'ngrok-skip-browser-warning': 'true',
				'Content-Type': 'application/json'  // Include if your endpoint expects JSON
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.error || 'Failed to trigger analysis');
		}
		return data;
	} catch (error) {
		console.error("Error triggering analysis:", error);
		return { error: "ERROR" };
	}
};

export const generateUsernamesPDF = async (authTokens, courseId) => {
	try {
		const response = await fetch(`${ACCOUNT_BASE_URL}/courses/${courseId}/generate_usernames_pdf/`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${authTokens.access}`,
				'ngrok-skip-browser-warning': 'true',
				'Content-Type': 'application/json'  // Include if your endpoint expects JSON
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.error || 'Failed to generate PDF');
		}
		return data.url;
	} catch (error) {
		console.error("Error generating PDF:", error);
		return { error: "ERROR" };
	}
};

export const generateUserReportPDF = async (authTokens) => {
	try {
		const response = await fetch(`${STUDYDATA_BASE_URL}/generate-user-report/`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${authTokens.access}`,
				'ngrok-skip-browser-warning': 'true',
				'Content-Type': 'application/json'  // Include if your endpoint expects JSON
			},
		});
		const data = await response.json();
		if (!response.ok) {
			throw new Error(data.error || 'Failed to generate user report PDF');
		}
		return data.message;
	} catch (error) {
		console.error("Error generating user report PDF:", error);
		return { error: "ERROR" };
	}
};



export const fetchAverageScoresByCourseAndSentence = async (courseId, startLocation, endLocation, authTokens) => {
	try {
		// Construct the URL with dynamic path segments for the GET request
		const url = new URL(`${STUDYDATA_BASE_URL}/average-course-sentence-scores/`);

		url.searchParams.append('start_location', startLocation);
		url.searchParams.append('end_location', endLocation);
		url.searchParams.append('course_id', courseId);

		const response = await fetch(url, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Authorization: "Bearer " + String(authTokens.access),
				"ngrok-skip-browser-warning": "true",
			}
		});

		if (!response.ok) {
			throw new Error("Failed to retrieve average scores");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching average scores:", error);
		throw error;
	}
};

export const logSynthSpeech = async (sentence, authTokens) => {
	try {
		const response = await fetch(
			`${STUDYDATA_BASE_URL}/log-synth-speech/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",
				},
				body: JSON.stringify({ sentence }),  // sentence = sentenceId
			}
		);

		if (!response.ok) {
			throw new Error("Failed to log synthetic speech");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error logging synthetic speech:", error);
		throw error;
	}
};


export const markUserReportDownloaded = async (authTokens) => {
	try {
		const response = await fetch(
			`${ACCOUNT_BASE_URL}/mark-user-report-as-downloaded/`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to decline user report");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Failed to decline user report:", error);
		throw error;
	}
};

export const fetchUserStudyStatus = async (authTokens) => {
	try {
		const response = await fetch(
			`${ACCOUNT_BASE_URL}/check-finished-study-and-downloaded-report/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch user study status");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching user study status:", error);
		throw error;
	}
};

export const fetchHealthCheck = async (authTokens) => {
	try {
		const response = await fetch(
			`${ACCOUNT_BASE_URL}/health-check/`,
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					Authorization: "Bearer " + String(authTokens.access),
					"ngrok-skip-browser-warning": "true",
				},
			}
		);

		if (!response.ok) {
			throw new Error("Failed to fetch health check data");
		}

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Error fetching health check data:", error);
		throw error;
	}
};

export const fetchToDoCompletionStats = async (authTokens) => {
    try {
        const response = await fetch(
            `${TODO_BASE_URL}/todo-completion-stats/`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + String(authTokens.access),
                    "ngrok-skip-browser-warning": "true",
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to fetch todo completion stats");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching todo completion stats:", error);
        throw error;
    }
};
