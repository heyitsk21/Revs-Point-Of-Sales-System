import React, { useState, useEffect } from 'react';
import './MenuBoard.css';
import axios from 'axios';

const MenuBoard = ({ onPageChange }) => {
    const [menuGroups, setMenuGroups] = useState([]);

    useEffect(() => {
        fetchMenuGroups();
    }, []);

    const fetchMenuGroups = async () => {
        try {
            const menuGroupsData = await Promise.all([
                fetchMenuGroup(100, 'Burgers'),
                fetchMenuGroup(200, 'Sandwiches'),
                fetchMenuGroup(300, 'Salads'),
                fetchMenuGroup(400, 'Desserts'),
                fetchMenuGroup(500, 'Drinks & Fries'),
                fetchMenuGroup(600, 'Value Meals'),
                fetchMenuGroup(700, 'Limited Time')
            ]);

            setMenuGroups(menuGroupsData);
        } catch (error) {
            console.error('Error fetching menu groups:', error);
        }
    };

    const fetchMenuGroup = async (group, title) => {
        try {
            const response = await axios.post('https://team21revsbackend.onrender.comapi/employee/getmenuitems', { menugroup: group });
            return { title, items: response.data };
        } catch (error) {
            console.error(`Error fetching menu items for group ${group}:`, error);
            return { title, items: [] };
        }
    };

    const renderMenuItems = () => {
        return menuGroups.map(group => (
            <div key={group.title} className="menu-group">
                <h2>{group.title}</h2>
                <div className="menu-items-container">
                    {group.items.map(item => (
                        <div key={item.menuid} className="menu-item">
                            <div className="item-name">{item.itemname}</div>
                            <div className="item-price">${item.price}</div>
                        </div>
                    ))}
                </div>
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
            {renderMenuItems()}
        </div>
    );
};

export default MenuBoard;
