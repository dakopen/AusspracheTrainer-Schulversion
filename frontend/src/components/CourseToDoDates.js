import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { fetchToDoDates } from "../utils/api";

const CourseToDoDates = ({ final_test_activated }) => {
    const { courseId } = useParams();
    const { authTokens } = useContext(AuthContext);
    const [todoDates, setTodoDates] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            try {
                const dates = await fetchToDoDates(authTokens, courseId);
                setTodoDates(groupToDoDates(dates));
            } catch (error) {
                console.error("Failed to load ToDo dates:", error);
            }
        };

        loadData();
    }, [courseId, authTokens]);

    const groupToDoDates = (dates) => {
        const groups = {
            group1to4: [],
            group5to10: [],
            group11to13: []
        };

        dates.forEach(date => {
            const todoId = date.standard_todo;
            if (todoId >= 1 && todoId <= 4) {
                groups.group1to4.push(date);
            } else if (todoId >= 5 && todoId <= 10) {
                groups.group5to10.push(date);
            } else if (todoId >= 11 && todoId <= 13) {
                groups.group11to13.push(date);
            }
        });

        // Optionally reduce each group to a single date or range if required
        groups.group1to4 = [reduceToSingleDate(groups.group1to4)];
        groups.group11to13 = [reduceToSingleDate(groups.group11to13)];

        return groups;
    };

    const reduceToSingleDate = (group) => {
        if (group.length === 0) return null;
        const earliestDate = group.reduce((prev, current) => prev.activation_date < current.activation_date ? prev : current);
        const latestDate = group.reduce((prev, current) => prev.due_date > current.due_date ? prev : current);
        return {
            standard_todo: `Group ${group[0].standard_todo} - ${group[group.length - 1].standard_todo}`,
            activation_date: earliestDate.activation_date,
            due_date: latestDate.due_date
        };
    };

    return (
        <div>
            <h3>ToDo Dates</h3>
            {todoDates.group1to4 && todoDates.group1to4.map((date, index) => (
                <div key={`group1to4-${index}`}>
                    <h4>Anfangstest</h4>
                    <p>Activation Date: {new Date(date.activation_date).toLocaleDateString()}, Due Date: {new Date(date.due_date).toLocaleDateString()}</p>
                </div>
            ))}
            <h4>Wöchentliche Übungen</h4>
            {todoDates.group5to10 && todoDates.group5to10.map((date, index) => (
                <div key={`group5to10-${index}`}>
                    <p>StandardTodo: {date.standard_todo} | Activation Date: {new Date(date.activation_date).toLocaleDateString()}, Due Date: {new Date(date.due_date).toLocaleDateString()}</p>
                </div>
            ))}
            {final_test_activated && todoDates.group11to13 && todoDates.group11to13.map((date, index) => (
                <div key={`group11to13-${index}`}>
                    <h4>Endtest</h4>
                    <p>Activation Date: {new Date(date.activation_date).toLocaleDateString()}, Due Date: {new Date(date.due_date).toLocaleDateString()}</p>
                </div>
            ))}
        </div>
    );
};

export default CourseToDoDates;
