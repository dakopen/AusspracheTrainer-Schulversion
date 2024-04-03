import React, { useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';

function SetPassword() {
  const [password, setPassword] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { addNotification } = useNotification();

  const handleSubmit = async (e) => {
    e.preventDefault();


    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const uid = params.get('uid');


    try {
      const response = await fetch('http://127.0.0.1:8000/accounts/set-password/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uid, token, password }),
      });

      if (response.ok) { // Check if status code is in the range 200-299
        alert('Password has been set successfully.');
        navigate('/login');
        
      } else {
        const errorData = await response.json(); // Assuming the server sends back JSON
        console.log('Response:', errorData);

        addNotification(errorData.error, 'error');

      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        New Password:
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </label>
      <button type="submit">Set Password</button>
    </form>
  );
}

export default SetPassword;
