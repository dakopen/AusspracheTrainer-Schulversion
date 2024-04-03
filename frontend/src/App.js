import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext';
import axios from 'axios';

import Header from './components/Header';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import CreateTeacher from './pages/CreateTeacher';
import SetPassword from './pages/SetPassword';


axios.defaults.baseURL = 'http://127.0.0.1:8000/';

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
          <Header />
          <Routes>
            <Route element={<PrivateRoute element={HomePage}/>} path="/" />
            <Route element={<LoginPage />} path="/login" />
            <Route element={<CreateTeacher/>} path="/create-teacher"/>
            <Route element={<SetPassword/>} path="set-password/" />
          </Routes>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;