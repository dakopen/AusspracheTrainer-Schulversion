import React from "react";

// Create a context with default values
export const UrlContext = React.createContext({
	//BASE_URL: `${window.location.protocol}//${window.location.hostname}:8000`,
	//BASE_URL: "https://tapir-perfect-thankfully.ngrok-free.app",
	BASE_URL: process.env.REACT_APP_API_BASE_URL,
	API_URL: "/api",  // will be combined with BASE_URL
	ACCOUNT_URL: "/accounts",
	STUDYDATA_URL: "/studydata",
	TODO_URL: "/todo",

});

// Optional: Create a custom provider if you need to calculate values or get them from props/environment
export const UrlProvider = ({ children }) => {
	//const BASE_URL = `${window.location.protocol}//${window.location.hostname}:8000`;
	//const BASE_URL = "https://tapir-perfect-thankfully.ngrok-free.app";
	//const BASE_URL = "http://127.0.0.1:8000";
	const BASE_URL = process.env.REACT_APP_API_BASE_URL;
	const API_BASE_URL = `${BASE_URL}api`;
	const ACCOUNT_BASE_URL = `${BASE_URL}accounts`;
	const STUDYDATA_BASE_URL = `${BASE_URL}studydata`;
	const TODO_BASE_URL = `${BASE_URL}todo`;

	return (
		<UrlContext.Provider
			value={{ BASE_URL, API_BASE_URL, ACCOUNT_BASE_URL, STUDYDATA_BASE_URL, TODO_BASE_URL }}
		>
			{children}
		</UrlContext.Provider>
	);
};
