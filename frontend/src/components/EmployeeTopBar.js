import React, { useState, useEffect } from 'react';
import { useTextSize } from './TextSizeContext';
import './EmployeeTopBar.css';
import './../Common.css';
import { useNavigate } from 'react-router-dom';

function EmployeeTopBar({ toggleHighContrast }) {
    const navigate = useNavigate();
    const { toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const [leftdropdownVisible, setLeftdropdownVisible] = useState(false);

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

    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    const toggleLeftDropdown = () => {
        setLeftdropdownVisible(!leftdropdownVisible);
    };

    const handleLogout = () => {
        console.log('Button clicked!');
        localStorage.setItem('authority', 0);
        localStorage.setItem('isLoggedIn', false);
        localStorage.setItem('userInfo', null);
        navigate('/');
    };

    return (
        <div className='manager-bar'>
            <div className="manager-navigation-container">
                <button className={`manager-dropdown-toggle ${leftdropdownVisible ? 'active' : ''}`} onClick={toggleLeftDropdown}>
                    <img src="/Images/navigationIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {leftdropdownVisible && (
                    <div className="manager-navigation-menu">
                        <button onClick={() => navigate('/customer')} >Customer</button>
                        <button onClick={() => navigate('/menuboard')} >Menu Board</button>
                    </div>
                )}
            </div>
            <div className='user-options'>
                <div className="manager-user-info">
                    <span>{`Welcome, ${localStorage.getItem('username')}`}</span>
                    <span>{currentTime}</span>
                </div>
                <button onClick={handleLogout} className="manager-top-bar-button">Logout</button>
            </div>
            <div className='placeholder-employee'></div>
            <div className="manager-dropdown-container">
                <button className={`manager-dropdown-toggle ${dropdownVisible ? 'active' : ''}`} onClick={toggleDropdown}>
                    <img src="/Images/accessibilityIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {dropdownVisible && (
                    <div className="manager-dropdown-menu">
                        <button className="manager-high-contrast-button" onClick={toggleHighContrast}>Toggle High Contrast</button>
                        <button onClick={toggleTextSize}>Toggle Text Size</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeTopBar;
