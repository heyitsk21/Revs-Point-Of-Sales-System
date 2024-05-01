import React, { useState, useEffect } from 'react';
import './CustHeader.css';
import './../../../Common.css';
import { useTextSize } from '../../../components/TextSizeContext';
import { useNavigate } from 'react-router-dom';
import Translate from '../../../components/translate';

const CustHeader = ({ onCatChange, toggleHighContrast }) => {
    const navigate = useNavigate();
    const { toggleTextSize } = useTextSize();
    const [currentTime, setCurrentTime] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const updateTime = () => {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}`;
        setCurrentTime(timeString);
    };

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
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
        <div className='cust-bar'>
            <div className='cust-welcome'>Welcome To Rev's!</div>
            <div className="cust-dropdown-container">
                <button className={`manager-dropdown-toggle`} onClick={toggleDropdown}>
                    <img src="/Images/accessibilityIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {dropdownVisible && (
                    <div className="cust-dropdown-menu">
                        <button className="manager-high-contrast-button" onClick={toggleHighContrast}>Toggle High Contrast</button>
                        <button onClick={toggleTextSize}>Toggle Text Size</button>
                        <Translate />
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustHeader;
