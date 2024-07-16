import React, { useEffect, useState, useContext } from "react";
import { fetchHealthCheck } from "../../utils/api.js";
import AuthContext from "../../context/AuthContext";
import './AccountHealthCheck.css';

const AccountHealthCheck = () => {
    const [healthCheckData, setHealthCheckData] = useState(null);
    const [error, setError] = useState(null);
    const { authTokens } = useContext(AuthContext);

    useEffect(() => {
        const getHealthCheckData = async () => {
            try {
                const data = await fetchHealthCheck(authTokens);
                setHealthCheckData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        getHealthCheckData();
    }, [authTokens]);

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (!healthCheckData) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="health-check-container">
            <h1 className="health-check-header">Health Check: Accounts & Schulen</h1>
            {healthCheckData.schools.map((school, index) => (
                <div key={index} className="school-stat">
                    <p className="school-detail"><strong><u>{school.name}</u></strong> {school.address}</p>
                    <p className="school-detail"><strong>Anzahl Lehrer:</strong> {school.total_teachers}</p>
                    <p className="school-detail"><strong>Anzahl Kurse:</strong> {school.total_courses}</p>
                </div>
            ))}
        </div>
    );
};

export default AccountHealthCheck;
