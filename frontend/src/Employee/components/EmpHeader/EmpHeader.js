import React, { useState, useEffect, useCallback } from 'react';
import './EmpHeader.css';
import { useTextSize } from '../../../components/TextSizeContext';
import { useNavigate } from 'react-router-dom';
import Translate from '../../../components/translate';

/**
 * Header component for the employee view.
 * @param {object} props - Props passed to the component.
 * @param {function} props.onCatChange - Function to handle category change.
 * @returns {JSX.Element} - The JSX element representing the EmpHeader component.
 */
const EmpHeader = ({ onCatChange }) => {
    const navigate = useNavigate();
    const { textSize, toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    /**
     * Function to handle user logout.
     */
    const handleLogout = () => {
        console.log('Button clicked!');
        localStorage.setItem('authority', 0);
        localStorage.setItem('isLoggedIn', false);
        localStorage.setItem('userInfo', null);
        navigate('/');
    };

    /**
     * Function to update current time every second.
     */
    const updateTime = () => {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        setCurrentTime(timeString);
    };

    useEffect(() => {
        setUsername(localStorage.getItem('userInfo').name);
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    /**
     * Function to speak text using text-to-speech synthesis.
     * @param {string} text - Text to be spoken.
     */
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
            <div className='translate'><Translate /></div>
        </div>
    );
};

export default EmpHeader;
