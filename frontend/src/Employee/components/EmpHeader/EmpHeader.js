import React, { useState, useEffect, useCallback } from 'react';
import './EmpHeader.css';
import { useTextSize } from '../../../components/TextSizeContext';
import { useNavigate } from 'react-router-dom';
import Translate from '../../../components/translate'

const EmpHeader = ({ onCatChange }) => {
    const navigate = useNavigate();
    const { textSize, toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const handleLogout = () => {
        console.log('Button clicked!');
        localStorage.setItem('authority', 0);
        localStorage.setItem('isLoggedIn', false);
        localStorage.setItem('userInfo', null);
        navigate('/');
    };

    const updateTime = () => {
        const date = new Date();
        const timeString = date.toLocaleTimeString();
        setCurrentTime(timeString);
    };

    useEffect(() => {
        setUsername(localStorage.getItem('userInfo').name)
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
                <span>{`Welcome, ${localStorage.getItem('username')}`}</span>
                <span>{currentTime}</span>
            </div>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={toggleTextSize}>Toggle Text Size</button>
            <Translate />
        </div>
    );
};

export default EmpHeader;
