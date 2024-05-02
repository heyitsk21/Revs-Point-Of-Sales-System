import React, { useState, useEffect } from 'react';
import { useTextSize } from './TextSizeContext';
import './ManagerTopBar.css';
import './../Common.css';
import { useNavigate } from 'react-router-dom';
import Translate from './translate.js';

/**
 * Functional component representing the top bar for manager navigation.
 * @param {Object} props - The props object containing the toggleHighContrast function.
 * @returns {JSX.Element} - The JSX element representing the manager top bar.
 */
function ManagerTopBar({ toggleHighContrast }) {
    const navigate = useNavigate();
    const { toggleTextSize } = useTextSize();
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

    /**
     * Function to handle button clicks.
     * @param {string} buttonName - The name of the button clicked.
     */
    const handleButtonClick = (buttonName) => {
        // Perform actions based on which button is clicked
        switch (buttonName) {
          case 'trends':
            // Do something for Trends button
            console.log('Trends button clicked');
            navigate('/manager/trends');
            break;
          case 'inventory':
            // Do something for Inventory button
            console.log('Inventory button clicked');
            navigate('/manager/inventory');
            break;
          case 'menuItems':
            // Do something for Menu Items button
            console.log('Menu Items button clicked');
            navigate('/manager/menuitems');
            break;
          case 'orderHistory':
            // Do something for Order History button
            console.log('Order History button clicked');
            navigate('/manager/orderhistory');
            break;
          case 'employeeManagement':
            console.log('Employee Management button clicked');
            navigate('/manager/employeemanagement');
            break;
          default:
            break;
        }
    };

    return (
        <div className='manager-bar'>
            {/* Left navigation dropdown */}
            <div className="manager-navigation-container">
                <button className={`manager-dropdown-toggle ${leftdropdownVisible ? 'active' : ''}`} onClick={toggleLeftDropdown}>
                    <img src="/Images/navigationIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {/* Left dropdown menu */}
                {leftdropdownVisible && (
                    <div className="manager-navigation-menu">
                        <button onClick={() => navigate('/employee')} >Employee</button>
                        <button onClick={() => navigate('/customer')} >Customer</button>
                        <button onClick={() => navigate('/kitchen')} >Kitchen</button>
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
            {/* Bottom navigation buttons */}
            <div className="manager-bar-nav">
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('trends')}>Trends</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('inventory')}>Inventory</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('menuItems')}>Menu Items</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('orderHistory')}>Order History</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('employeeManagement')}>Employees</button>
            </div>
            {/* Main dropdown container */}
            <div className="manager-dropdown-container">
                <button className={`manager-dropdown-toggle ${dropdownVisible ? 'active' : ''}`} onClick={toggleDropdown}>
                    <img src="/Images/accessibilityIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {/* Main dropdown menu */}
                {dropdownVisible && (
                    <div className="manager-dropdown-menu">
                        <button onClick={toggleTextSize}>Toggle Text Size</button>
                        <button onClick={toggleHighContrast}>Toggle High Contrast</button>
                        <div className='manager-translate'><Translate /></div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManagerTopBar;
