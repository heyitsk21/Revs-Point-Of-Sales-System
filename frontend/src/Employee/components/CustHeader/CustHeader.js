import React, { useState, useEffect, useCallback } from 'react';
import './CustHeader.css';
import { useTextSize } from '../../../components/TextSizeContext';
import { useNavigate } from 'react-router-dom';


const EmpHeader = ({ onCatChange }) => {
    const navigate = useNavigate();
    const { textSize, toggleTextSize } = useTextSize();
    const [currentTime, setCurrentTime] = useState('');

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
                <span>Welcome to Rev's!</span>
            </div>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={() => speakText("Employee... Sandwiches... Sides... Drinks... Limited Time")}>Speak</button>
            <button onClick={toggleTextSize}>Toggle Text Size</button>
            <button> Work Hours </button>
        </div>
    );
};

export default EmpHeader;
