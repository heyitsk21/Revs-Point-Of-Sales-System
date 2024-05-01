import React, { useState, useEffect } from 'react';
import './CustHeader.css';
import { useTextSize } from '../../../components/TextSizeContext';
import { useNavigate } from 'react-router-dom';
import Translate from '../../../components/translate';

const CustHeader = ({ onCatChange, toggleHighContrast }) => {
    const navigate = useNavigate();
    const { textSize, toggleTextSize } = useTextSize();
    const [currentTime, setCurrentTime] = useState('');

    const updateTime = () => {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        setCurrentTime(timeString);
    };

    useEffect(() => {
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleLogout = () => {
        console.log('Logout button clicked!');
        localStorage.setItem('authority', 0);
        localStorage.setItem('isLoggedIn', false);
        localStorage.setItem('userInfo', null);
        navigate('/');
    };

    const handleToggleHighContrast = () => {
        toggleHighContrast(); 
    };

    return (
        <div className="cust-top-bar">
            <div className="cust-user-info">
                <span>Welcome to Rev's!</span>
                <span>{currentTime}</span>
            </div>
            <button onClick={handleLogout}>Logout</button>
            <button onClick={toggleTextSize}>Toggle Text Size</button>
            <button onClick={handleToggleHighContrast}>Toggle High Contrast</button>
            <div className='translate'><Translate /></div>
        </div>
    );
};

export default CustHeader;
