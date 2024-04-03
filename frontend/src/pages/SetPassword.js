// SetPassword.js

import React, { useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

function SetPassword() {
  const [password, setPassword] = useState('');
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const params = new URLSearchParams(location.search);
    const token = params.get('token');
    const uid = params.get('uid');

    try {
      const response = await axios.post('/accounts/set-password/', { uid, token, password });
      if (response.status === 200) {
        alert('Password has been set successfully.');
      }
    } catch (error) {
      alert('Failed to set password. The link might be expired or invalid.');
      console.error(error);
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
