import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	AdminRoute,
	TeacherOrSecretaryOrAdminRoute,
} from "./utils/PrivateRoute";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UrlProvider } from "./context/UrlContext";

import axios from "axios";

import Header from "./components/Header";
import "./components/Notification.css";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import CreateTeacher from "./pages/CreateTeacher";
import CreateAnyRole from "./pages/CreateAnyRole";
import CreateSchool from "./pages/CreateSchool";
import CreateCourse from "./pages/CreateCourse";
import SetPassword from "./pages/SetPassword";

axios.defaults.baseURL = "http://127.0.0.1:8000/";

function App() {
	return (
		<div>
			<Router>
				<UrlProvider>
					<NotificationProvider>
						<AuthProvider>
							<Header />
							<Routes>
								<Route
									element={
										<TeacherOrSecretaryOrAdminRoute
											element={HomePage}
										/>
									}
									path="/"
								/>
								<Route
									element={<AdminRoute element={HomePage} />}
									path="/adminroute"
								/>
								<Route element={<LoginPage />} path="/login" />
								<Route
									element={<CreateTeacher />}
									path="/create-teacher"
								/>
								<Route
									element={<CreateAnyRole />}
									path="/create-any-role"
								/>
								<Route
									element={<SetPassword />}
									path="set-password/"
								/>
								<Route
									element={<CreateSchool />}
									path="/create-school"
								/>
								<Route
									element={<CreateCourse />}
									path="/create-course"
								/>
							</Routes>
						</AuthProvider>
					</NotificationProvider>
				</UrlProvider>
			</Router>
		</div>
	);
}

export default App;
