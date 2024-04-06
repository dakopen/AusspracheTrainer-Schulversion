import React, { createContext, useContext, useState } from "react";

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
			// Automatically remove the notification after 10 seconds
			setNotifications((current) =>
				current.filter((notification) => notification.id !== id)
			);
		}, 10000);
	};

	return (
		<NotificationContext.Provider value={{ addNotification }}>
			{children}
			<div className="notifications-container">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`notification ${notification.type}`}
					>
						{notification.message}
					</div>
				))}
			</div>
		</NotificationContext.Provider>
	);
};
