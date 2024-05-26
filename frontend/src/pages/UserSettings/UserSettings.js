import React, { Component } from 'react';
import DeleteAccount from '../../components/DeleteAccount';
import ChangeUsername from '../../components/ChangeUsername';
import './UserSettings.css';

class UserSettings extends Component {
    render() {
        return (
            <div className="user-settings-container">
                <h1 className="user-settings-title">Benutzereinstellungen</h1>
                <div className="account-management-section">
                    <h2 className="account-management-title">Kontoverwaltung</h2>
                    <p className="account-management-description">Verwalte deine Kontoeinstellungen unten. Bitte beachte, dass jede Änderung unwiderruflich ist und du unbedingt Zugriff auf deine Mail Adresse dafür benötigst.</p>

                    {/* Change Username Component */}
                    <section className="change-username-section">
                        <h3 className="section-title">Benutzernamen ändern</h3>
                        <ChangeUsername />
                    </section>

                    {/* Delete Account Component */}
                    <section className="delete-account-section">
                        <h3 className="section-title">Konto löschen</h3>
                        <DeleteAccount />
                    </section>
                </div>
            </div>
        );
    }
}

export default UserSettings;
