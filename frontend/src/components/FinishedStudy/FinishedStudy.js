import React, { useContext } from "react";
import { useNotification } from "../../context/NotificationContext";
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from "../../context/AuthContext";

import './FinishedStudy.css';
import { generateUserReportPDF, markUserReportDownloaded } from '../../utils/api';

const FinishedStudy = ({ reportSent, status }) => {
    const navigate = useNavigate();
    const { addNotification } = useNotification();
    const { user, authTokens } = useContext(AuthContext);


    const handleGenerateUserReportPDF = async () => {
        try {
            const url = await generateUserReportPDF(authTokens);
            if (url.error) {
                throw new Error('Failed to generate user report PDF');
            }
            addNotification("Der Report wurde erfolgreich generiert. In Kürze erhälst Du eine Mail.", "success");
        } catch (error) {
            console.error("Error generating user report PDF:", error);
            addNotification("Es ist ein Fehler beim Generieren aufgetreten.", "error");
        }
    };

    const requestReport = () => {
        handleGenerateUserReportPDF();
        status.downloaded_report = true;
    };

    const declineReport = () => {
        markUserReportDownloaded(authTokens);
        addNotification("Du hast den Report erfolgreich abgelehnt.", "success")
        status.downloaded_report = true;
    };
    return (
        <div className="finished-study-container">
            <h3 className="finished-study-header">Studie Abgeschlossen</h3>
            <p>Du hast die Studie erfolgreich abgeschlossen. Vielen Dank für Deine Teilnahme!</p>
            {!reportSent &&
                <>
                    <p>Wir können Dir einen Bericht über Deine persönlichen Ergebnisse in der Studie per E-Mail zusenden. Bitte stelle sicher, dass Du Zugriff auf Deine anfangs angegebene E-Mail-Adresse hast. Wenn du keinen Zugriff auf deine E-Mail-Adresse hast oder den Bericht nicht erhalten möchtest, wähle bitte "Nein, danke, ich möchte den Report nicht erhalten".</p>
                    <div className="finished-study-detail">
                        <button className="finished-study-button left-button" onClick={requestReport}>Bericht anfordern</button>
                        <button className="finished-study-button right-button" onClick={declineReport}>Nein, danke, ich möchte den Report nicht erhalten</button>
                    </div>
                </>
            }
        </div>
    );
};

export default FinishedStudy;
