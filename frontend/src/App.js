import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	AdminRoute,
	SecretaryOrAdminRoute,
	TeacherOrAdminRoute,
	TeacherRoute,
	StudentRoute,
	TeacherOrSecretaryOrAdminRoute,
} from "./utils/PrivateRoute";

import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { UrlProvider } from "./context/UrlContext";

import axios from "axios";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import "./components/Notification.css";

import SetPassword from "./pages/SetPassword/SetPassword";
import LoginPage from "./pages/LoginPage/LoginPage";
import StudyStudentLogin from "./pages/StudyStudentLogin/StudyStudentLogin";
import CreateTeacher from "./pages/CreateTeacher";
import CreateAnyRole from "./pages/CreateAnyRole";

import HomePage from "./pages/HomePage/HomePage";
import Schools from "./pages/Schools";
import ShowSchool from "./pages/ShowSchool";
import Courses from "./pages/Courses/Courses";
import ShowCourse from "./pages/ShowCourse/ShowCourse";
import StudySentences from "./pages/StudySentences";
import UserSettings from "./pages/UserSettings/UserSettings";
import SentenceDisplay from "./pages/SentenceDisplay";
import DeleteAccountConfirm from "./components/DeleteAccountConfirm";

import FirstQuestionnaire from "./pages/FirstQuestionnaire/FirstQuestionnaire";
import EmailQuestionnaire from "./pages/EmailQuestionnaire/EmailQuestionnaire";

import "./App.css";
import Tutorial from "./pages/Tutorial";
import PronunciationTest from "./pages/PronunciationTest";
import FinalQuestionnaire from "./pages/FinalQuestionnaire/FinalQuestionnaire";
import RequestPasswordReset from "./pages/RequestPasswordReset/RequestPasswordReset";
import ForgotUsername from "./pages/ForgotUsername/ForgotUsername";
import TutorialPage from "./pages/TutorialPage";
import Contact from "./pages/Legal/Contact";
import Privacy from "./pages/Legal/Privacy";


function App() {
	return (
		<div>
			<Router>
				<UrlProvider>
					<NotificationProvider>
						<AuthProvider>
							<Header />
							<div style={{ minHeight: "90vh" }}>
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
										path="/first-questionnaire/"
									/>
									<Route
										element={
											<StudentRoute
												element={EmailQuestionnaire}
											/>
										}
										path="/set-email/"
									/>
									<Route
										element={
											<TeacherOrSecretaryOrAdminRoute
												element={StudySentences}
											/>
										}
										path="/sentences"
									/>
									<Route
										element={<StudentRoute element={UserSettings} />}
										path="/account-settings"
									/>
									<Route
										element={<DeleteAccountConfirm />}
										path="delete-account-confirm/:uidb64/:token/"
									/>
									<Route
										element={<StudentRoute element={TutorialPage} />}
										path="/tutorial/"
									/>
									<Route
										element={
											<StudentRoute
												element={PronunciationTest}
											/>
										}
										path="test/"
									/>
									<Route
										element={
											<StudentRoute
												element={PronunciationTest}
											/>
										}
										path="practice/"
									/>
									<Route
										element={<StudentRoute element={FinalQuestionnaire} />}
										path="/final-questionnaire/"
									/>
									<Route
										element={<RequestPasswordReset />}
										path="request-password-reset/"
									/>
									<Route
										element={<ForgotUsername />}
										path="forgot-username/"
									/>
									<Route
										element={
											<TeacherOrSecretaryOrAdminRoute
												element={SentenceDisplay}
											/>
										}
										path="/courses/:courseId/:todoId" />
									<Route element={<Contact />} path="/contact" />
									<Route element={<Privacy />} path="/privacy" />
								</Routes>
							</div>
							<Footer />
						</AuthProvider>
					</NotificationProvider>
				</UrlProvider>
			</Router>
		</div>
	);
}

export default App;
