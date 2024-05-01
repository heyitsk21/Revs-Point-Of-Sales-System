import React, { useState, useEffect } from 'react';
import { useTextSize } from './TextSizeContext';
import './ManagerTopBar.css';
import './../Common.css';
import { useNavigate } from 'react-router-dom';
import Translate from './translate.js';

function ManagerTopBar({ toggleHighContrast }) {
    const navigate = useNavigate();
    const { toggleTextSize } = useTextSize();
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
            <div className="manager-navigation-container">
                <button className={`manager-dropdown-toggle ${leftdropdownVisible ? 'active' : ''}`} onClick={toggleLeftDropdown}>
                    <img src="/Images/navigationIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {leftdropdownVisible && (
                    <div className="manager-navigation-menu">
                        <button onClick={() => navigate('/employee')} >Employee</button>
                        <button onClick={() => navigate('/customer')} >Customer</button>
                        <button onClick={() => navigate('/kitchen')} >Kitchen</button>
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
            <div className="manager-bar-nav">
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('trends')}>Trends</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('inventory')}>Inventory</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('menuItems')}>Menu Items</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('orderHistory')}>Order History</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('employeeManagement')}>Employees</button>
            </div>
            <div className="manager-dropdown-container">
                <button className={`manager-dropdown-toggle ${dropdownVisible ? 'active' : ''}`} onClick={toggleDropdown}>
                    <img src="/Images/accessibilityIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {dropdownVisible && (
                    <div className="manager-dropdown-menu">
                        <button onClick={toggleTextSize}>Toggle Text Size</button>
                        <button onClick={toggleHighContrast}>Toggle High Contrast</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManagerTopBar;
