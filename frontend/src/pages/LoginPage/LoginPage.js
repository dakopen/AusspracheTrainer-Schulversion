import React, { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'
import './LoginPage.css'


const LoginPage = () => {
	const { sendToLogin } = useContext(AuthContext);
	const [showPassword, setShowPassword] = useState(false);

	const togglePasswordVisibility = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className="staff-login-form">
			<h1>Lehrer:innen Login</h1>
			<form onSubmit={sendToLogin}>
				<div className="staff-input-container">
					<input type="text" name="username" placeholder="E-Mail eingeben" />
					<input type={showPassword ? 'text' : 'password'} name="password" placeholder="Passwort eingeben" className='password-input' />
					<div>
						<Link to="/request-password-reset" className="loginpage-forgot-password hidden">Passwort vergessen?</Link>
						<button type="button" onClick={togglePasswordVisibility} className="staff-show-password">
							{showPassword ? 'Verbergen' : 'Zeigen'}
						</button>
						<Link to="/request-password-reset" className="loginpage-forgot-password">Passwort vergessen?</Link>
					</div>
				</div>
				<div className="staff-input-container">
					<input type="submit" value="Einloggen" />
				</div>
			</form>
		</div>
	);
}

export default LoginPage;