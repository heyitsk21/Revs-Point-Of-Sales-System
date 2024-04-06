import React, { useState, useEffect, useCallback } from 'react';
import './Employee.css';
import { useTextSize } from '../TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests

const Employee = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [category, setCategory] = useState('Sandwiches');
    const [selectedMenuSection] = useState(null);  //setSelectedMenuSection
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [burgerList, setBurgerList] = useState([]);
    const [sandwichList, setSandwichList] = useState([]);
    const [saladList, setSaladList] = useState([]);
    const [dessertList, setDessertList] = useState([]);
    const [drinksList, setDrinksList] = useState([]);
    const [valueList, setValueList] = useState([]);
    const [limitedList, setLimitedList] = useState([]);

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

    const fetchMenuSection = async (currentIdStart) => {
        try {
            const response = await axios.post('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/employee/getmenuitems',  { menugroup: currentIdStart });
            switch (currentIdStart) {
                case 100:
                    setBurgerList(response.data);
                    break;
                case 200:
                    setSandwichList(response.data);
                    break;
                case 300:
                    setSaladList(response.data);
                    break;
                case 400:
                    setDessertList(response.data);
                    break;
                case 500:
                    setDrinksList(response.data);
                    break;
                case 600:
                    setValueList(response.data);
                    break;
                case 700:
                    setLimitedList(response.data);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const fetchMenuSectionsPeriodically = useCallback(() => {
        fetchMenuSection(100); // Fetch Burger menu items
        fetchMenuSection(200); // Fetch Sandwiches menu items
        fetchMenuSection(300);
        fetchMenuSection(400);
        fetchMenuSection(500);
        fetchMenuSection(600);
        fetchMenuSection(700);
    }, []);

    useEffect(() => {
        if (!initialFetchDone) {
            fetchMenuSectionsPeriodically(); // Fetch menu sections initially
            setInitialFetchDone(true);
        }
        const intervalId = setInterval(fetchMenuSectionsPeriodically, 2 * 60 * 1000); // Fetch menu sections every 2 minutes
        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [fetchMenuSectionsPeriodically, initialFetchDone]);

    const handleCategories = (categoryName, currentIdStart) => {
        fetchMenuSection(currentIdStart); // Fetch menu section immediately when category is changed
        setCategory(categoryName);
    };

    const renderMenuSection = () => {
        let selectedList;
        switch (category) {
            case 'Burgers':
                selectedList = burgerList;
                break;
            case 'Sandwiches':
                selectedList = sandwichList;
                break;
            case 'Salads':
                selectedList = saladList;
                break;
            case 'Desserts':
                selectedList = dessertList;
                break;
            case 'Drinks & Fries':
                selectedList = drinksList;
                break;
            case 'Value Meals':
                selectedList = valueList;
                break;
            case 'Limited Time':
                selectedList = limitedList;
                break;
            default:
                break;
        }

        return selectedList.map(menuitem => (
            <div key={menuitem.menuid} className={`itemname ${selectedMenuSection && selectedMenuSection.menuid === menuitem.menuid ? 'selected' : ''}`} onClick={() => handleCategories(menuitem)}>
                <div>Item Name: {menuitem.itemname}</div>
                <div>Menu ID: {menuitem.menuid}</div>
                <div>Price: {menuitem.price}</div>
            </div>
        ));
    };
    
    /* FULL MENU CODE

    const renderEmpty = () => {
        return;
    };



    // Function to fetch all menu items from the backend API
    const fetchAllMenuItems = async () => {
        try {
            const response = await axios.get('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/menuitems');
            setAllMenuItems(response.data); // Update menu section state with response data
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    // Call fetchAllMenuItems function when component mounts
    useEffect(() => {
        fetchAllMenuItems();
    }, []);

    const renderAllMenuItems = () => {
        return allmenuitems.map(menuitem => (
            <div key={menuitem.itemname} className={`itemname ${selectedMenuSection && selectedMenuSection.menuid === menuitem.menuid ? 'selected' : ''}`} onClick={() => handleOrderClick(menuitem)}>
                <div>Item Name: {menuitem.itemname}</div>
                <div>Menu ID: {menuitem.menuid}</div>
                <div>Price: {menuitem.price}</div>
            </div>
        ));
    };
    */


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
                <section className="layout">
                    <div className="leftSide">
                        {category}
                        <div className='items'>
                            {/* {renderEmpty()} */}
                            {renderMenuSection()}
                        </div>
                    </div>
                    <div className="rightSide">
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
