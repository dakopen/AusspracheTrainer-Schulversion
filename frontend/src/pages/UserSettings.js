import React from 'react';
import DeleteAccount from '../components/DeleteAccount'; 
import ChangeUsername from '../components/ChangeUsername';

const UserSettings = () => {
    return (
        <div>
            <h1>User Settings</h1>
            <div>
                <h2>Account Management</h2>
                <p>Manage your account settings and preferences below.</p>
                
                {/* Change Username Component */}
                <section>
                    <h3>Change Your Username</h3>
                    <ChangeUsername />
                </section>
                
                {/* Delete Account Component */}
                <section>
                    <h3>Delete Your Account</h3>
                    <DeleteAccount />
                </section>
            </div>
        </div>
    );
};

export default UserSettings;
