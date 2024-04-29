import React, { useState, useEffect } from 'react';
import './MenuBoard.css';
import axios from 'axios';
import revLogo from './rev.png';
import Translate from './components/translate';
import MenuItemScroll from './MenuItemScroll';

const MenuBoard = ({ onPageChange }) => {
    const [menuGroups, setMenuGroups] = useState([]);
    const [marqueeText, setMarqueeText] = useState('Your Promotional Text Here...');

    useEffect(() => {
        fetchMenuGroups();
    }, []);

    const fetchMenuGroups = async () => {
        try {
            const menuGroupsData = await Promise.all([
                fetchMenuGroup(100, 'Burgers'),
                fetchMenuGroup(200, 'Sandwiches'),
                fetchMenuGroup(400, 'Desserts'),
                fetchMenuGroup(700, 'Limited Time'),
                fetchMenuGroup(500, 'Drinks & Fries'),
                fetchMenuGroup(300, 'Salads'),
                fetchMenuGroup(600, 'Value Meals')
            ]);
            setMenuGroups(menuGroupsData);
        } catch (error) {
            console.error('Error fetching menu groups:', error);
        }
    };

    const fetchMenuGroup = async (group, title) => {
        try {
            const response = await axios.post('https://team21revsbackend.onrender.com/api/employee/getmenuitems', { menugroup: group });
            return { title, items: response.data };
        } catch (error) {
            console.error(`Error fetching menu items for group ${group}:`, error);
            return { title, items: [] };
        }
    };

    const handleMarqueeTextChange = (event) => {
        setMarqueeText(event.target.innerText);
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

    return (
        <div className="menu-board">
            <div className="marquee">
                <div className="marquee-content">
                    <span
                        contentEditable
                        suppressContentEditableWarning={true}
                        onBlur={handleMarqueeTextChange}
                        dangerouslySetInnerHTML={{ __html: marqueeText }}
                    />
                    <img src={revLogo} alt="Rev Logo" className="marquee-image" />
                </div>
            </div>
            <div className="clearfix">
                <h1 className="menu-title">Rev's American Grill</h1>
                {renderMenuItems()}
            </div>
            <MenuItemScroll menuGroups={menuGroups} />
            <Translate />
        </div>
    );
};

export default MenuBoard;
