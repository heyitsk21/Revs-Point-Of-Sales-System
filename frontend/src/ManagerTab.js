import React, { useState, useEffect } from 'react';
import './ManagerTab.css';
import { useTextSize } from './TextSizeContext';

const ManagerTab = ({ onPageChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
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
        <div className={`manager-tab ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="top-bar">
                <div className="user-info">
                    <span>{loggedIn ? `Welcome, ${username}` : 'Please log in'}</span>
                    <span>{currentTime}</span>
                </div>
                <button onClick={handleLoginLogout} onMouseOver={() => handleMouseOver('Login button')}>{loggedIn ? 'Logout' : 'Login'}</button>
                <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak} onMouseOver={() => handleMouseOver('Speak button')}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                <button onClick={toggleTextSize} onMouseOver={() => handleMouseOver('Toggle Text Size button')}>Toggle Text Size</button>
            </div>

            <div id="google_translate_element"></div>

            <div className="middle-content">
                <h1 onMouseOver={() => handleMouseOver('Manager header')}>MANAGER</h1>
            </div>

            <div className="bottom-nav">
                <button onClick={() => onPageChange('trends')} onMouseOver={() => handleMouseOver('Trends button')}>Trends</button>
                <button onClick={() => onPageChange('inventory')} onMouseOver={() => handleMouseOver('Inventory button')}>Inventory</button>
                <button onClick={() => onPageChange('menuItems')} onMouseOver={() => handleMouseOver('Menu Items button')}>Menu Items</button>
                <button onClick={() => onPageChange('orderHistory')} onMouseOver={() => handleMouseOver('Order History button')}>Order History</button>
            </div>
        </div>
    );
};

export default ManagerTab;
