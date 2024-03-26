import React, { useState } from 'react';
import './ManagerTab.css'; // Import CSS file for styling

const ManagerTab = ({ onPageChange }) => {
    const [loggedIn, setLoggedIn] = useState(false); // State to track login status
    const [username, setUsername] = useState(''); // State to store username
    const [currentTime, setCurrentTime] = useState(''); // State to store current time

    // Function to handle login/logout
    const handleLoginLogout = () => {
        if (loggedIn) {
            setLoggedIn(false);
            setUsername('');
        } else {
            // Simulate login process
            const fakeUsername = 'JohnDoe'; // Example username
            setLoggedIn(true);
            setUsername(fakeUsername);
        }
    };

    // Function to update current time
    const updateTime = () => {
        const date = new Date();
        const timeString = date.toLocaleTimeString(); // Format time as HH:MM:SS
        setCurrentTime(timeString);
    };

    // Set interval to update current time every second
    setInterval(updateTime, 1000);

    return (
        <div className="manager-tab">
            {/* Top bar */}
            <div className="top-bar">
                <div className="user-info">
                    <span>{loggedIn ? `Welcome, ${username}` : 'Please log in'}</span>
                    <span>{currentTime}</span>
                </div>
                <button onClick={handleLoginLogout}>{loggedIn ? 'Logout' : 'Login'}</button>
            </div>

            {/* Middle content */}
            <div className="middle-content">
                <h1>MANAGER</h1>
            </div>

            {/* Bottom navigation */}
            <div className="bottom-nav">
                <button onClick={() => onPageChange('trends')}>Trends</button>
                <button onClick={() => onPageChange('inventory')}>Inventory</button>
                <button onClick={() => onPageChange('menuItems')}>Menu Items</button>
                <button onClick={() => onPageChange('orderHistory')}>Order History</button>
            </div>
        </div>
    );
};

export default ManagerTab;
