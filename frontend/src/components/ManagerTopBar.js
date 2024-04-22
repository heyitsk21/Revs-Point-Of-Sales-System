import React, { useState, useEffect } from 'react';
import { useTextSize } from './TextSizeContext';
import './ManagerTopBar.css';
import { useNavigate } from 'react-router-dom';

function ManagerTopBar() {
    const navigate = useNavigate();
    const { toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [speakEnabled, setSpeakEnabled] = useState(false);
    const [dropdownVisible, setDropdownVisible] = useState(false);

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

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const handleLogout = () => {
        console.log('Button clicked!');
        localStorage.setItem('authority', 0);
        localStorage.setItem('isLoggedIn', false);
        localStorage.setItem('userInfo', null);
        navigate('/');
    };

    return (
        <div className="top-bar">
            <div className="user-info">
                <span>{`Welcome, ${localStorage.getItem('username')}`}</span>
                <span>{currentTime}</span>
            </div>

            <button onClick={handleLogout}>Logout</button>

            <div className="dropdown-container">
                <button className={`dropdown-toggle ${dropdownVisible ? 'active' : ''}`} onClick={toggleDropdown}>
                    <i className="fa fa-cog"></i>
                </button>
                {dropdownVisible && (
                    <div className="dropdown-menu">
                        <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak} onMouseOver={() => handleMouseOver('Speak button')}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                        <button onClick={toggleTextSize} onMouseOver={() => handleMouseOver('Toggle Text Size button')}>Toggle Text Size</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManagerTopBar;
