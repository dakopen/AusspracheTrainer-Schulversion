import React from 'react'
import { useNotification } from '../context/NotificationContext';

const HomePage = () => {
  const { addNotification } = useNotification();
  return (
    <div className="App">
      <p>Homepage</p>
      <button onClick={() => addNotification('Error! Something went wrong.', 'error')}>
        Show Error
      </button>
          </div>
  );
}

export default HomePage
