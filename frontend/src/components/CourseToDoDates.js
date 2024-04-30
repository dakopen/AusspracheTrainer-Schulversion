import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { fetchToDoDates } from "../utils/api";

const CourseToDoDates = () => {
    const { courseId } = useParams();
    const { authTokens } = useContext(AuthContext);
    const [todoDates, setTodoDates] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dates = await fetchToDoDates(authTokens, courseId);
                setTodoDates(dates);
            } catch (error) {
                console.error("Failed to load ToDo dates:", error);
            }
        };

        loadData();
    }, [courseId, authTokens]);

    return (
        <div>
            <h3>ToDo Dates</h3>
            {todoDates.length > 0 ? (
                <ul>
                    {todoDates.map((date, index) => (
                        <li key={index}>
                            StandardTodo: {date.standard_todo}{" | "}
                            Activation Date: {new Date(date.activation_date).toLocaleDateString()},
                            Due Date: {new Date(date.due_date).toLocaleDateString()}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No ToDo dates available.</p>
            )}
        </div>
    );
};

export default CourseToDoDates;
