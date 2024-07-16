import React, { useEffect, useState, useContext } from "react";
import { fetchToDoCompletionStats } from "../../utils/api.js";
import AuthContext from "../../context/AuthContext";
import './ToDoHealthCheck.css';

const ToDoHealthCheck = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(null);
    const { authTokens } = useContext(AuthContext);


    useEffect(() => {
        const getStats = async () => {
            try {
                const data = await fetchToDoCompletionStats(authTokens);
                setStats(data);
            } catch (error) {
                setError(error.message);
            }
        };

        getStats();
    }, [authTokens]);

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!stats) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="todo-health-check-container">
            <h1 className="todo-health-check-header">ToDo Completion Statistics</h1>
            <ol>
                {stats.map((stat, index) => (
                    <li key={index} className="todo-stat">
                        <div className="todo-title">{stat.todo_title}</div>
                        <div className="todo-detail">{stat.completed_count} completed</div>
                    </li>
                ))}
            </ol>
        </div>
    );
};

export default ToDoHealthCheck;
