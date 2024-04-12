import React, { useState, useEffect, useCallback } from 'react';
import './EmpHeader.css';
import { useTextSize } from '../../../TextSizeContext';
const EmpHeader = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const handleLoginLogout = () => {
        if (loggedIn) {
            setLoggedIn(false);
            setUsername('');
        } else {
            const fakeUsername = 'JohnDoe';
            setLoggedIn(true);
            setUsername(fakeUsername);
        }
    };

    const updateTime = () => {
        const date = new Date();
        const timeString = date.toLocaleTimeString();
        setCurrentTime(timeString);
    };

    useEffect(() => {
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className="top-bar">
            <div className="user-info">
                <span>{loggedIn ? `Welcome, ${username}` : 'Please log in'}</span>
                <span>{currentTime}</span>
            </div>
            <button onClick={handleLoginLogout}>{loggedIn ? 'Logout' : 'Login'}</button>
            <button onClick={() => speakText("Employee... Sandwiches... Sides... Drinks... Limited Time")}>Speak</button>
            <button onClick={toggleTextSize}>Toggle Text Size</button>
            <button> Work Hours </button>
        </div>
    );
};

export default EmpHeader;
