import React, { useContext } from 'react';
import { completeStandardTodo } from "../utils/api";
import AuthContext from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

const Tutorial = ({ standardTodo }) => {
    let { authTokens } = useContext(AuthContext);
    const { addNotification } = useNotification();
    let navigate = useNavigate();

    const handleCompleteClick = () => {
        completeStandardTodo(standardTodo, authTokens)
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
