import React, { useState, useEffect } from 'react';
import './Employee.css';
import { useTextSize } from '../TextSizeContext';

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

    const handleCategories = (categoryName) => {
        setCategory(categoryName);
    };

    const sandwichList = ['Sandwich 1', 'Sandwich 2', 'Sandwich 3'];
    const sidesList = ['Side 1', 'Side 2', 'Side 3'];
    const drinkList = ['Drink 1', 'Drink 2', 'Drink 3'];
    const limitedList = ['Limited Item 1', 'Limited Item 2', 'Limited Item 3'];

    let currentCat;
    let items;
    switch (category) {
        case 'Sandwiches':
            currentCat = 'Sandwiches';
            items = sandwichList;
            break;
        case 'Sides':
            currentCat = 'Sides';
            items = sidesList;
            break;
        case 'Drinks':
            currentCat = 'Drinks';
            items = drinkList;
            break;
        case 'Limited Time':
            currentCat = 'Limited Time';
            items = limitedList;
            break;
        default:
            currentCat = 'Sandwiches';
            items = sandwichList;
    }

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
                            items
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
