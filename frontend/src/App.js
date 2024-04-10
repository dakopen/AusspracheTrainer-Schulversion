import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	AdminRoute,
	SecretaryOrAdminRoute,
	TeacherOrAdminRoute,
	TeacherRoute,
	StudentRoute,
} from "./utils/PrivateRoute";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UrlProvider } from "./context/UrlContext";

import axios from "axios";

import Header from "./components/Header";
import "./components/Notification.css";
import FirstQuestionnaire from "./components/FirstQuestionnaire";

import SetPassword from "./pages/SetPassword";
import LoginPage from "./pages/LoginPage";
import StudyStudentLogin from "./pages/StudyStudentLogin";
import CreateTeacher from "./pages/CreateTeacher";
import CreateAnyRole from "./pages/CreateAnyRole";

import HomePage from "./pages/HomePage";
import Schools from "./pages/Schools";
import ShowSchool from "./pages/ShowSchool";
import Courses from "./pages/Courses";
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
								<Route
									element={<LoginPage />}
									path="/rolelogin"
								/>
								<Route
									element={<StudyStudentLogin />}
									path="/login"
								/>
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
									element={<AdminRoute element={Schools} />}
									path="/schools"
								/>
								<Route
									element={
										<SecretaryOrAdminRoute
											element={ShowSchool}
										/>
									}
									path="/schools/:schoolId"
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
								<Route
									element={
										<StudentRoute
											element={FirstQuestionnaire}
										/>
									}
									path="/first-questionnaire"
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
