import React from "react";

// Create a context with default values
export const UrlContext = React.createContext({
	API_BASE_URL: "http://127.0.0.1:8000",
	ACCOUNT_BASE_URL: "/accounts", // This will be combined with API_BASE_URL in components
	STUDYDATA_BASE_URL: "/studydata", // This will be combined with API_BASE_URL in components
});

// Optional: Create a custom provider if you need to calculate values or get them from props/environment
export const UrlProvider = ({ children }) => {
	const API_BASE_URL = "http://127.0.0.1:8000"; // This could be dynamic
	const ACCOUNT_BASE_URL = `${API_BASE_URL}/accounts`;
	const STUDYDATA_BASE_URL = `${API_BASE_URL}/studydata`;

	return (
		<UrlContext.Provider
			value={{ API_BASE_URL, ACCOUNT_BASE_URL, STUDYDATA_BASE_URL }}
		>
			{children}
		</UrlContext.Provider>
	);
};
