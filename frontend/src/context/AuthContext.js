import { createContext, useState, useEffect, useCallback, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useNotification } from "./NotificationContext";
import { UrlContext } from "./UrlContext";

const AuthContext = createContext();
// import NotificationContext from './NotificationContext'

export default AuthContext;

export const AuthProvider = ({ children }) => {
	let [authTokens, setAuthTokens] = useState(() =>
		localStorage.getItem("authTokens")
			? JSON.parse(localStorage.getItem("authTokens"))
			: null
	);
	let [user, setUser] = useState(() =>
		localStorage.getItem("authTokens")
			? jwtDecode(localStorage.getItem("authTokens"))
			: null
	);
	let [loading, setLoading] = useState(true);
	const { addNotification } = useNotification();
	const { BASE_URL, API_BASE_URL } = useContext(UrlContext);
	const navigate = useNavigate();

	let sendToLogin = async (e) => {
		e.preventDefault();
		let username = e.target.username.value;
		let password = e.target.password.value;
		await loginUserWithCredentials(username, password);
	};

	let sendToStudyStudentLogin = async (e) => {
		e.preventDefault();
		let username =
			e.target.username.value + "@studie.aussprachetrainer.org";
		let password = e.target.username.value;
		await loginUserWithCredentials(username, password);
	};

	let loginUserWithCredentials = async (username, password) => {
		let response = await fetch(`${API_BASE_URL}/token/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: username,
				password: password,
			}),
		});
		let data = await response.json();
		console.log("data:", data);
		if (response.status === 200) {
			setAuthTokens(data);
			setUser(jwtDecode(data.access));
			localStorage.setItem("authTokens", JSON.stringify(data));
			addNotification("Erfolgreich eingeloggt", "success");
			navigate("/");
		} else {
			alert("Etwas ist schiefgelaufen");
		}
	};

	let loginUser = async (e) => {
		e.preventDefault();
		let response = await fetch(`${API_BASE_URL}/token/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: e.target.username.value,
				password: e.target.password.value,
			}),
		});
		let data = await response.json();
		console.log("data:", data);
		if (response.status === 200) {
			setAuthTokens(data);
			setUser(jwtDecode(data.access));
			localStorage.setItem("authTokens", JSON.stringify(data));
			navigate("/");
		} else {
			alert("Etwas ist schiefgelaufen");
		}
	};

	let logoutUser = useCallback(() => {
		setAuthTokens(null);
		setUser(null);
		localStorage.removeItem("authTokens");
	}, []);

	let updateToken = useCallback(async () => {
		console.log("Updated token!");

		let response = await fetch(`${API_BASE_URL}/token/refresh/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ refresh: authTokens?.refresh }),
		});
		let data = await response.json();
		console.log("data:", data);
		if (response.status === 200) {
			setAuthTokens(data);
			setUser(jwtDecode(data.access));
			localStorage.setItem("authTokens", JSON.stringify(data));
		} else {
			logoutUser();
		}

		if (loading) {
			setLoading(false);
		}
	}, [authTokens, logoutUser, loading]);

	let contextData = {
		user: user,
		authTokens: authTokens,
		loginUser: loginUser,
		logoutUser: logoutUser,
		sendToLogin: sendToLogin,
		sendToStudyStudentLogin: sendToStudyStudentLogin,
		loginUserWithCredentials: loginUserWithCredentials,
	};

	let tenMinutes = 600000;
	useEffect(() => {
		if (loading) {
			updateToken();
		}

		let interval = setInterval(() => {
			if (authTokens) {
				updateToken();
			}
		}, tenMinutes);

		return () => clearInterval(interval);
	}, [authTokens, loading, tenMinutes, updateToken]);

	return (
		<AuthContext.Provider value={contextData}>
			{loading ? null : children}
		</AuthContext.Provider>
	);
};
