import React, { useState, useEffect } from 'react';
import { useTextSize } from './TextSizeContext';
import './ManagerTopBar.css';
import './../Common.css';
import { useNavigate } from 'react-router-dom';

function ManagerTopBar() {
    const navigate = useNavigate();
    const { toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [speakEnabled, setSpeakEnabled] = useState(false);
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
                <button onClick={handleLogout} className = "manager-top-bar-button">Logout</button>
            </div>   
            <div className="manager-bar-nav">
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('trends')}>Trends</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('inventory')}>Inventory</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('menuItems')}>Menu Items</button>
                <button className="manager-bottom-bar-button" onClick={() => handleButtonClick('orderHistory')}>Order History</button>
            </div>
            <div className="manager-dropdown-container">
                <button className={`manager-dropdown-toggle ${dropdownVisible ? 'active' : ''}`} onClick={toggleDropdown}>
                    <img src="/Images/accessibilityIcon.png" alt="Accessibility" className="manager-dropdown-icon" />
                    <i className="fa fa-cog"></i>
                </button>
                {dropdownVisible && (
                    <div className="manager-dropdown-menu">
                        <button className={`manager-speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak} onMouseOver={() => handleMouseOver('Speak button')}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                        <button onClick={toggleTextSize} onMouseOver={() => handleMouseOver('Toggle Text Size button')}>Toggle Text Size</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ManagerTopBar;
