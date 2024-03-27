import React, { useState, useEffect } from 'react';
import './ManagerTab.css'; // Import CSS file for styling
import { useTextSize } from './TextSizeContext'; // Import the useTextSize hook

const ManagerTab = ({ onPageChange }) => {
    const { textSize, toggleTextSize } = useTextSize(); // Get textSize and toggleTextSize from context
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
    useEffect(() => {
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    // Load Google Translate when component mounts
    useEffect(() => {
        // Check if Google Translate API is already loaded
        if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);

            // Initialize Google Translate button
            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
            };
        }
    }, []);

    return (
        <div className={`manager-tab ${textSize === 'large' ? 'large-text' : ''}`}>
            {/* Top bar */}
            <div className="top-bar">
                <div className="user-info">
                    <span>{loggedIn ? `Welcome, ${username}` : 'Please log in'}</span>
                    <span>{currentTime}</span>
                </div>
                <button onClick={handleLoginLogout}>{loggedIn ? 'Logout' : 'Login'}</button>
                {/* Button to toggle text size */}
                <button onClick={toggleTextSize}>Toggle Text Size</button>
            </div>

            {/* Google Translate button */}
            <div id="google_translate_element"></div>

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
