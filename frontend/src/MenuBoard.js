import React, { useState, useEffect } from 'react';
import './MenuBoard.css';
import axios from 'axios';

const MenuBoard = ({ onPageChange }) => {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        fetchMenuItems();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/manager/menuitems');
            setMenuItems(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const renderMenuItems = () => {
        return menuItems.map(item => (
            <div key={item.menuid} className="menu-item">
                <div className="item-name">{item.itemname}</div>
                <div className="item-price">${item.price}</div>
            </div>
        ));
    };

    const handleReturnClick = () => {
        onPageChange('manager');
    };

    return (
        <div className="menu-board">
            <button className="return-button" onClick={handleReturnClick}>Return to Manager</button>
            <h1 className="menu-title">Menu</h1>
            <div className="menu-items-container">
                {renderMenuItems()}
            </div>
        </div>
    );
};

export default MenuBoard;
