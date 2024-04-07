import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	AdminRoute,
	SecretaryOrAdminRoute,
	TeacherOrAdminRoute,
	TeacherRoute,
} from "./utils/PrivateRoute";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UrlProvider } from "./context/UrlContext";

import axios from "axios";

import Header from "./components/Header";
import "./components/Notification.css";

import SetPassword from "./pages/SetPassword";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import Courses from "./pages/Courses";
import CreateTeacher from "./pages/CreateTeacher";
import CreateAnyRole from "./pages/CreateAnyRole";
import CreateSchool from "./pages/CreateSchool";
import ShowCourse from "./pages/ShowCourse";

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
								<Route element={<HomePage />} path="/" />
								<Route
									element={<AdminRoute element={HomePage} />}
									path="/adminroute"
								/>
								<Route element={<LoginPage />} path="/login" />
								<Route
									element={
										<SecretaryOrAdminRoute
											element={CreateTeacher}
										/>
									}
									path="/create-teacher"
								/>
								<Route
									element={
										<AdminRoute element={CreateAnyRole} />
									}
									path="/create-any-role"
								/>
								<Route
									element={<SetPassword />}
									path="set-password/"
								/>
								<Route
									element={
										<AdminRoute element={CreateSchool} />
									}
									path="/create-school"
								/>
								<Route
									element={
										<TeacherOrAdminRoute
											element={Courses}
										/>
									}
									path="/courses"
								/>
								<Route
									element={
										<TeacherOrAdminRoute
											element={ShowCourse}
										/>
									}
									path="/courses/:courseId"
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
