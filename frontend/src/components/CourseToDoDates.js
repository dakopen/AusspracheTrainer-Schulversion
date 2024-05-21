import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
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
        navigate(generateDetailWeekLink(todoId));
    }

    const generateDetailWeekLink = (todoId) => {
        if (todoId >= 5 && todoId <= 10) {
            return `/courses/${courseId}/${todoId}`;
        } else if (todoId === "group1to4") {
            return `/courses/${courseId}/4`;
        } else if (todoId === "group11to13") {
            return `/courses/${courseId}/12`;
        }
    }

    function getGroupIndex(dateKey) {
        if (dateKey.includes('group1to4')) return '1';
        else if (dateKey.includes('group5to10')) return '2';
        else if (dateKey.includes('group11to13')) return '3';
        return ''; // default
    }


    return (
        <div className="todo-dates-container">
            <hr></hr>
            <h3 className="todo-dates-header">Zeitpunkte der Übungen</h3>
            {console.log(editData)}
            {console.log(editData.length)}
            {editData["group1to4"] &&
                // <div className="todo-date-group" {/**/} onClick={() => handleHeadlineClick(editData["group1to4"].standard_todo)}>
                <div className="todo-date-group">
                    <div className="todo-index-display">1</div>
                    <div className="todo-dates-content">
                        <h4>Anfangstest (falls möglich in der Schule)</h4>
                        <p>Aktiviert am: {new Date(editData["group1to4"].activation_date).toLocaleDateString()} - <Link to={generateDetailWeekLink("group1to4")}>hier</Link> klicken für Details</p>
                        <p>Die Studie kann nun von Schüler:innen begonnen werden. Geben Sie dazu jedem Teilnehmenden einen Schüleraccount aus, mit dem man sich auf studie.aussprachetrainer.org einloggen kann.</p>
                    </div>
                </div>
            }
            {editData["group5to10-0"] &&
                <div className="todo-date-group">
                    <div className="todo-index-display">2</div>
                    <div className="todo-dates-content">
                        <h4>Wöchentliche Übungen (zuhause)</h4>
                        {Object.entries(editData).map(([dateKey, date]) => {
                            const currentDate = new Date();
                            const activationDate = new Date(date.activation_date);
                            const dueDate = new Date(date.due_date);
                            const isActive = currentDate >= activationDate && currentDate <= dueDate;
                            const isPast = currentDate > dueDate;
                            const className = isActive ? 'currently-active-tododate' : isPast ? 'passed-tododate' : '';

                            console.log(dateKey.includes('group5to10'))
                            if (dateKey.includes('group5to10')) {
                                return (
                                    <div className={`todo-dates-training ${className}`}>
                                        <p className="todo-date-training-week">Training Woche {parseInt(dateKey.replace('group5to10-', '')) + 1} - <Link to={generateDetailWeekLink(date.standard_todo)}>hier</Link> klicken für Details</p>
                                        <div className="date-input-container">
                                            <label className="todo-date-label">Start: <small>17:00 Uhr</small></label>
                                            <input
                                                type="date"
                                                className="todo-date-input"
                                                value={new Date(date.activation_date).toISOString().slice(0, 10)}
                                                onChange={e => handleDateChange(dateKey, 'activation_date', e.target.value)}
                                            />
                                        </div>

                                        <div className="date-input-container">
                                            <label className="todo-date-label">Fälligkeit: <small>16:59 Uhr</small></label>
                                            <input
                                                type="date"
                                                className="todo-date-input"
                                                value={new Date(date.due_date).toISOString().slice(0, 10)}
                                                onChange={e => handleDateChange(dateKey, 'due_date', e.target.value)}
                                            />
                                        </div>
                                        <button
                                            className="todo-date-button"
                                            onClick={() => saveDateChanges(dateKey)}
                                            disabled={!hasChanged[dateKey] || !isDateValid(date.activation_date) || !isDateValid(date.due_date)}
                                        >
                                            Änderung speichern
                                        </button>
                                    </div>

                                );
                            }
                            return null;
                        })}
                    </div>
                </div>
            }
            {editData["group11to13"] && editData["group11to13"].activation_date && editData["group11to13"].due_date !== editData["group11to13"].activation_date &&
                <div className="todo-date-group">
                    <div className="todo-index-display">3</div>
                    <div className="todo-dates-content">
                        <h4>Finaler Test (falls möglich in der Schule)</h4>
                        <p>Aktiviert am: {new Date(editData["group11to13"].activation_date).toLocaleDateString()} - <Link to={generateDetailWeekLink("group11to13")}>hier</Link> klicken für Details</p>
                        <p>Die Studie ist fast zuende. Ein finaler Test (wenn möglich im Computerraum der Schule) fehlt noch, den die Schüler:innen zusammen mit einem Fragebogen beantworten sollen.</p>
                    </div>
                </div>}




        </div>
    );
};

export default CourseToDoDates;
