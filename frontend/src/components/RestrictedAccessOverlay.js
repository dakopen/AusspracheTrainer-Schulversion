import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

const RestrictedAccessOverlay = () => {
    const overlayStyle = {
        position: 'absolute',
        top: 0,
        left: 0,
        transform: 'translateX(-50%)',
        width: 'max(100%, 400px)',
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        padding: '20px',
        boxSizing: 'border-box',
        zIndex: 10, // Ensure it is above other elements
    };

    const textStyle = {
        marginTop: '10px',
        fontSize: '15px',
        color: '#333',
    };

    return (
        <div style={overlayStyle}>
            <FontAwesomeIcon icon={faCheck} size="xl" />
            <div style={textStyle}>
                Dein Ergebnis wurde gespeichert. <br></br>Da du zur Kontrollgruppe gehörst, siehst du leider erst am Ende der Studie die Auswertung.
            </div>
        </div>
    );
};

export default RestrictedAccessOverlay;
