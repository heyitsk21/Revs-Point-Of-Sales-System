import React, { useState, useEffect } from 'react';
import './Employee.css';
import { useTextSize } from '../TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests

const Employee = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');

    const handleLoginLogout = () => {
        if (loggedIn) {
            setLoggedIn(false);
            setUsername('');
        } else {
            const fakeUsername = 'JohnDoe';
            setLoggedIn(true);
            setUsername(fakeUsername);
        }
    };

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

    const [category, setCategory] = useState('Sandwiches');
    const [selectedMenuSection, setSelectedMenuSection] = useState(null); 

    const handleCategories = (categoryName) => {
        setCategory(categoryName);
    };

    let currentCat;
    switch (category) {
        case 'Sandwiches':
            currentCat = 'Sandwiches';
            break;
        case 'Sides':
            currentCat = 'Sides';
            break;
        case 'Drinks':
            currentCat = 'Drinks';
            break;
        case 'Limited Time':
            currentCat = 'Limited Time';
            break;
        default:
            currentCat = 'Sandwiches';
    }

    const [allmenuitems, setMenuSections] = useState([]); // Initialize state for menu section

    // Function to fetch order history from the backend API
    const fetchMenuSection = async () => {
        try {
            const response = await axios.get('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/menuitems');
            setMenuSections(response.data); // Update menu section state with response data
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    // Call fetchMenuSection function when component mounts
    useEffect(() => {
        fetchMenuSection();
    }, []);

    const handleOrderClick = (menusection) => {
        setSelectedMenuSection(menusection);
    };

    const renderMenuItems = () => {
        return allmenuitems.map(menuitem => (
            <div key={menuitem.itemname} className={`itemname ${selectedMenuSection && selectedMenuSection.menuid === menuitem.menuid ? 'selected' : ''}`} onClick={() => handleOrderClick(menuitem)}>
                <div>Item Name: {menuitem.itemname}</div>
                <div>Menu ID: {menuitem.menuid}</div>
                <div>Price: {menuitem.price}</div>
            </div>
        ));
    };

    return (
        <div className={`employee ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="top-bar">
                <div className="user-info">
                    <span>{loggedIn ? `Welcome, ${username}` : 'Please log in'}</span>
                    <span>{currentTime}</span>
                </div>
                <button onClick={handleLoginLogout}>{loggedIn ? 'Logout' : 'Login'}</button>
                <button onClick={() => speakText("Employee... Sandwiches... Sides... Drinks... Limited Time")}>Speak</button>
                <button onClick={toggleTextSize}>Toggle Text Size</button>
            </div>

            <div id="google_translate_element"></div>

            <div className="middle-content">
                <section class="layout">
                    <div class="leftSide">
                        {currentCat}
                        <div class = 'items'>
                            {
                            //items
                            renderMenuItems()
                            /* <button>Sandwich 1</button>
                            <button>Sandwich 2</button>
                            <button>Sandwich 3</button> */}
                        </div>
                    </div>
                    <div class="rightSide">
                        Current Order
                    </div>                    
                </section>
            </div>

            <div className="bottom-nav">
                <button onClick={() => handleCategories('Sandwiches')}>Sandwiches</button>
                <button onClick={() => handleCategories('Sides')}>Sides</button>
                <button onClick={() => handleCategories('Drinks')}>Drinks</button>
                <button onClick={() => handleCategories('Limited Time')}>Limited Time</button>
            </div>
        </div>
    );
};

export default Employee;
