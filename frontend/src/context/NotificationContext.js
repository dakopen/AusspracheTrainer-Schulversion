import React, { createContext, useContext, useState } from "react";
import './NotificationStyles.css'; // Importing CSS for styling

// Create Context
const NotificationContext = createContext();

// Custom hook for easy access
export const useNotification = () => useContext(NotificationContext);

// Provider Component
export const NotificationProvider = ({ children }) => {
	const [notifications, setNotifications] = useState([]);
	let notificationCounter = 0;

	const addNotification = (message, type) => {
		const id = `${new Date().getTime()}-${notificationCounter++}`; // Unique ID
		setNotifications((prev) => [...prev, { id, message, type }]);
		setTimeout(() => {
			removeNotification(id);
		}, 10000);
	};

	const removeNotification = (id) => {
		setNotifications((current) =>
			current.filter((notification) => notification.id !== id)
		);
	};

	return (
		<NotificationContext.Provider value={{ addNotification, removeNotification }}>
			{children}
			<div className="notifications-container">
				{notifications.map((notification) => (
					<div key={notification.id} className={`notification ${notification.type}`}>
						<span className="notification-content">{notification.message}</span>
						<span className="notification-close" onClick={() => removeNotification(notification.id)}>×</span>
					</div>
				))}
			</div>
		</NotificationContext.Provider>
	);
};
