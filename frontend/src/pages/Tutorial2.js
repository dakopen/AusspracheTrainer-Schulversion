import React, { useContext, useState, useEffect } from 'react';
import { completeStandardTodo, fetchLowestPriorityUserToDo } from "../utils/api";
import AuthContext from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const Tutorial = () => {
    let { authTokens } = useContext(AuthContext);
    const { addNotification } = useNotification();
    let navigate = useNavigate();
    const [todo_id, setTodo_id] = useState(-1);

    useEffect(() => {
        const fetchTodo = async () => {
            try {
                const result = await fetchLowestPriorityUserToDo(authTokens);
                console.log("Fetched todo:", result);
                let id = result.id;
                if (id == 3 || id == 11) {
                    setTodo_id(id);
                } else {
                    addNotification("Bitte die Aufgaben Reihenfolge einhalten.", "error");
                    navigate("/");
                }
            } catch (err) {
                console.error("Error fetching todo:", err);
            }
        };

        fetchTodo();
    }, [authTokens]);

    const handleCompleteClick = () => {
        completeStandardTodo(todo_id, authTokens)
            .then(response => {
                addNotification(
                    "Tutorial abgeschlossen",
                    "success"
                );
                navigate("/");

            }).catch(error => {
                console.error("Error completing tutorial:", error);
                addNotification(
                    "Fehler ist im Tutorial aufgetreten abgeschlossen",
                    "error"
                );
            });
    };

    return (
        <div>
            <h1>Tutorial</h1>
            <div>
                <h2>Complete the Tutorial</h2>
                <p>Press the button below to complete the tutorial.</p>
                <button onClick={handleCompleteClick}>Complete Tutorial</button> {/* Add the onClick event listener */}
            </div>
        </div>
    );
};

export default Tutorial;
