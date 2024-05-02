import React, { useState, useEffect } from 'react';
import { useTextSize } from './TextSizeContext';
import './EmployeeTopBar.css';
import './../Common.css';
import { useNavigate } from 'react-router-dom';
import Translate from './../components/translate';

/**
 * Functional component representing the top bar for employee navigation.
 * @param {Object} props - The props object containing the toggleHighContrast function.
 * @returns {JSX.Element} - The JSX element representing the employee top bar.
 */
function EmployeeTopBar({ toggleHighContrast }) {
    const navigate = useNavigate();
    const { toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false); // State for tracking login status
    const [username, setUsername] = useState(''); // State for storing username
    const [currentTime, setCurrentTime] = useState(''); // State for storing current time
    const [dropdownVisible, setDropdownVisible] = useState(false); // State for controlling dropdown visibility
    const [leftdropdownVisible, setLeftdropdownVisible] = useState(false); // State for controlling left dropdown visibility

    /**
     * Function to update the current time every second.
     */
    const updateTime = () => {
        const date = new Date();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        const timeString = `${hours}:${minutes}:${seconds}`;
        setCurrentTime(timeString);
    };

    useEffect(() => {
        const interval = setInterval(updateTime, 1000); // Update time every second
        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, []);

    /**
     * Function to toggle the visibility of the main dropdown menu.
     */
    const toggleDropdown = () => {
        setDropdownVisible(!dropdownVisible);
    };

    /**
     * Function to toggle the visibility of the left dropdown menu.
     */
    const toggleLeftDropdown = () => {
        setLeftdropdownVisible(!leftdropdownVisible);
    };

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

    return (
        <div className='manager-bar'>
            <div className="manager-navigation-container">
                {/* Left dropdown button */}
                <button className={`manager-dropdown-toggle ${leftdropdownVisible ? 'active' : ''}`} onClick={toggleLeftDropdown}>
                    <img src="/Images/navigationIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {/* Left dropdown menu */}
                {leftdropdownVisible && (
                    <div className="manager-navigation-menu">
                        <button onClick={() => navigate('/customer')} >Customer</button>
                        <button onClick={() => navigate('/menuboard')} >Menu Board</button>
                    </div>
                )}
            </div>
            {/* User options section */}
            <div className='user-options'>
                <div className="manager-user-info">
                    <span>{`Welcome, ${localStorage.getItem('username')}`}</span>
                    <span>{currentTime}</span>
                </div>
                <button onClick={handleLogout} className="manager-top-bar-button">Logout</button>
            </div>
            {/* Placeholder */}
            <div className='placeholder-employee'></div>
            <div className="manager-dropdown-container">
                {/* Main dropdown button */}
                <button className={`manager-dropdown-toggle ${dropdownVisible ? 'active' : ''}`} onClick={toggleDropdown}>
                    <img src="/Images/accessibilityIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {/* Main dropdown menu */}
                {dropdownVisible && (
                    <div className="manager-dropdown-menu">
                        <button className="manager-high-contrast-button" onClick={toggleHighContrast}>Toggle High Contrast</button>
                        <button onClick={toggleTextSize}>Toggle Text Size</button>
                        <Translate />
                    </div>
                )}
            </div>
        </div>
    );
}

export default EmployeeTopBar;
