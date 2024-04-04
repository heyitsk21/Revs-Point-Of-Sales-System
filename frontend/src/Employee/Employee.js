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
    let currentIdStart;
    switch (category) {
        case 'Burgers':
            currentCat = 'Burgers';
            currentIdStart = 100;
            break;
        case 'Sandwiches':
            currentCat = 'Sandwiches';
            currentIdStart = 200;
            break;
        case 'Salads':
            currentCat = 'Salads';
            currentIdStart = 300;
            break;
        case 'Desserts':
            currentCat = 'Desserts';
            currentIdStart = 400;
            break;
        case 'Drinks & Fries':
            currentCat = 'Drinks & Fries';
            currentIdStart = 500;
            break;
        case 'Value Meals':
                currentCat = 'Value Meals';
                currentIdStart = 600;
                break;
        case 'Limited Time':
            currentCat = 'Limited Time';
            currentIdStart = 700;
            break;
        default:
            currentCat = 'Burgers';
            currentIdStart = 100;
    }

    const [allmenuitems, setAllMenuItems] = useState([]); // Initialize state for all menu items
    const [menuitemsection, setMenuSection] = useState([]); // Initialize state for one menu section

    // Function to fetch all menu items from the backend API
    const fetchAllMenuItems = async () => {
        try {
            const response = await axios.get('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/menuitems');
            setAllMenuItems(response.data); // Update menu section state with response data
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    // Function to fetch one menu section from the backend API
    const fetchMenuSection = async (currentIdStart) => {
        try {
            console.log(currentIdStart);
            const response = await axios.post('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/employee/getmenuitems',  {menugroup:currentIdStart});
            setMenuSection(response.data); // Update menu section state with response data
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    // Call fetchAllMenuItems function when component mounts
    useEffect(() => {
        fetchAllMenuItems();
    }, []);

    // Call fetchMenuSection function when component mounts
    useEffect(() => {
        fetchMenuSection(currentIdStart);
    }, [currentIdStart]);

    const handleOrderClick = (menusection) => {
        setSelectedMenuSection(menusection);
    };

    const renderAllMenuItems = () => {
        return allmenuitems.map(menuitem => (
            <div key={menuitem.itemname} className={`itemname ${selectedMenuSection && selectedMenuSection.menuid === menuitem.menuid ? 'selected' : ''}`} onClick={() => handleOrderClick(menuitem)}>
                <div>Item Name: {menuitem.itemname}</div>
                <div>Menu ID: {menuitem.menuid}</div>
                <div>Price: {menuitem.price}</div>
            </div>
        ));
    };

    const renderMenuSection = () => {
        return menuitemsection.map(menuitem => (
            <div key={menuitem.menuid} className={`itemname ${selectedMenuSection && selectedMenuSection.menuid === menuitem.menuid ? 'selected' : ''}`} onClick={() => handleOrderClick(menuitem)}>
                <div>Item Name: {menuitem.itemname}</div>
                <div>Menu ID: {menuitem.menuid}</div>
                <div>Price: {menuitem.price}</div>
            </div>
        ));
    };

    const renderEmpty = () => {
        return;
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
                            {renderEmpty()}
                            {
                            //items
                            // renderAllMenuItems()
                            renderMenuSection()
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
                <button onClick={() => handleCategories('Value Meals')}>Value Meals</button>
                <button onClick={() => handleCategories('Burgers')}>Burgers</button>
                <button onClick={() => handleCategories('Sandwiches')}>Sandwiches</button>
                <button onClick={() => handleCategories('Salads')}>Salads</button>
                <button onClick={() => handleCategories('Desserts')}>Desserts</button>
                <button onClick={() => handleCategories('Drinks & Fries')}>Drinks & Fries</button>
                <button onClick={() => handleCategories('Limited Time')}>Limited Time</button>
            </div>
        </div>
    );
};

export default Employee;
