import React, { useState, useEffect } from 'react';
import { useTextSize } from './TextSizeContext';

import './ManagerTopBar.css';

function ManagerTopBar(){
    const {  toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [speakEnabled, setSpeakEnabled] = useState(false);

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
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        setCurrentTime(timeString);
    };

    useEffect(() => {
        const interval = setInterval(updateTime, 100);
        return () => clearInterval(interval);
    }, []);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    const handleMouseOver = (text) => {
        if (speakEnabled) {
            setTimeout(() => {
                speakText(text);
            }, 1000); // 1-second delay
        }
    };

    const toggleSpeak = () => {
        if (speakEnabled) {
            window.speechSynthesis.cancel();
        }
        setSpeakEnabled(!speakEnabled);
    };
    
    return (
    <div className="top-bar">
        <div className="user-info">
            <span>{loggedIn ? `Welcome, ${username}` : 'Please log in'}</span>
            <span>{currentTime}</span>
        </div>

        <button onClick={handleLoginLogout} onMouseOver={() => handleMouseOver('Login button')}>{loggedIn ? 'Logout' : 'Login'}</button>
        <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak} onMouseOver={() => handleMouseOver('Speak button')}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
        <button onClick={toggleTextSize} onMouseOver={() => handleMouseOver('Toggle Text Size button')}>Toggle Text Size</button>
    </div>

    );
}

export default ManagerTopBar;