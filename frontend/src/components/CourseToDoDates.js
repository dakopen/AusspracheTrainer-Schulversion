import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AuthContext from "../context/AuthContext";
import { fetchToDoDates, updateToDoDates } from "../utils/api";

const CourseToDoDates = ({ final_test_activated }) => {
    const { courseId } = useParams();
    const { authTokens } = useContext(AuthContext);
    const [todoDates, setTodoDates] = useState({ group1to4: [], group5to10: [], group11to13: [] });
    const [editData, setEditData] = useState({}); // Holds editable data for dates
    const navigate = useNavigate();
    const [hasChanged, setHasChanged] = useState({});

    useEffect(() => {
        const loadData = async () => {
            try {
                const dates = await fetchToDoDates(authTokens, courseId);
                const groupedDates = groupToDoDates(dates);
                setTodoDates(groupedDates);
                initializeEditData(groupedDates);
            } catch (error) {
                console.error("Failed to load ToDo dates:", error);
            }
        };

        loadData();
    }, [courseId, authTokens, final_test_activated]);

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



    const initializeEditData = (groupedDates) => {
        const newEditData = {};
        Object.keys(groupedDates).forEach(group => {
            if (groupedDates[group].length > 0) {
                // If it's group5to10, assign each date its own object
                if (group === 'group5to10') {
                    groupedDates[group].forEach((date, index) => {
                        newEditData[`${group}-${index}`] = { ...date }; // Create a new object for each date
                    });
                } else {
                    // For other groups, continue as before
                    newEditData[group] = { ...groupedDates[group][0] };
                }
            }
        });
        setEditData(newEditData);
    };


    const handleDateChange = (dateKey, field, value) => {
        if (!value) {
            // If the value is empty, revert to the last known good value or handle as needed
            alert("Please select a valid date.");
            return; // Stop processing further, effectively ignoring the clear action
        }

        setEditData(prevState => ({
            ...prevState,
            [dateKey]: {
                ...prevState[dateKey],
                [field]: new Date(value).toISOString()
            }
        }));
        setHasChanged({ ...hasChanged, [dateKey]: true });
    };
    const saveDateChanges = async (dateKey) => {
        if (!editData[dateKey] || !hasChanged[dateKey]) return;
        try {
            await updateToDoDates(authTokens, courseId, editData[dateKey].standard_todo, editData[dateKey]);
            alert("Dates updated successfully!");
            setHasChanged({ ...hasChanged, [dateKey]: false });  // Reset change tracking after save
        } catch (error) {
            console.error("Error updating ToDo dates:", error);
            alert("Error updating ToDo dates.");
        }
    };

    const isDateValid = (date) => {
        return !isNaN(new Date(date).getTime());
    };

    const handleHeadlineClick = (todoId) => {
        if (todoId >= 5 && todoId <= 10) {
            navigate(`/courses/${courseId}/${todoId}`);
        } else if (todoId === "Group 1 - 4") {
            navigate(`/courses/${courseId}/4`);
        } else if (todoId === "Group 11 - 13") {
            navigate(`/courses/${courseId}/12`);
        }
    }

    return (
        <div className="todo-dates-container">
            <h3 className="todo-dates-header">ToDo Dates</h3>
            {Object.entries(editData).map(([dateKey, date]) => (
                <div key={dateKey} className="todo-date-group">
                    <h4 onClick={() => handleHeadlineClick(date.standard_todo)}>
                        {dateKey.includes('group5to10') ? 'Wöchentliche Übungen' : (dateKey.includes('group1to4') ? 'Anfangstest' : 'Endtest')}
                    </h4>
                    <p>StandardTodo: {date.standard_todo}</p>
                    {dateKey.includes('group5to10') ? (
                        <>
                            <label className="todo-date-label">Activation Date:</label>
                            <input
                                type="date"
                                className="todo-date-input"
                                value={new Date(date.activation_date).toISOString().slice(0, 10)}
                                onChange={e => handleDateChange(dateKey, 'activation_date', e.target.value)}
                            />
                            <label className="todo-date-label">Due Date:</label>
                            <input
                                type="date"
                                className="todo-date-input"
                                value={new Date(date.due_date).toISOString().slice(0, 10)}
                                onChange={e => handleDateChange(dateKey, 'due_date', e.target.value)}
                            />
                            <button
                                className="todo-date-button"
                                onClick={() => saveDateChanges(dateKey)}
                                disabled={!hasChanged[dateKey] || !isDateValid(date.activation_date) || !isDateValid(date.due_date)}
                            >
                                Save Changes
                            </button>
                        </>
                    ) : (
                        <p>Activation Date: {new Date(date.activation_date).toLocaleDateString()}, Due Date: {new Date(date.due_date).toLocaleDateString()}</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default CourseToDoDates;
