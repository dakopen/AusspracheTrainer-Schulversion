import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

function CreateTeacher() {
  const [email, setEmail] = useState('');
  // Assume token is stored somewhere after login, e.g., localStorage
  let {authTokens} = useContext(AuthContext);
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Include the Authorization header with the JWT
      const response = await axios.post('/accounts/create-teacher/', { username: email }, {
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authTokens.access}`
        }
      });
      if (response.status === 201) {
        alert('User created successfully. A link has been sent to their email to set a password.');
      }
    } catch (error) {
      alert('There was an error creating the user.');
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </label>
      <button type="submit">Create User</button>
    </form>
  );
}

export default CreateTeacher;
