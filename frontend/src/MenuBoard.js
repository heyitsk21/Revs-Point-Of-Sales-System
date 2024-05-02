/**
 * Component for displaying the menu board.
 * @param {Object} props - The props object containing the onPageChange function.
 * @returns {JSX.Element} The JSX element representing the menu board.
 */
import React, { useState, useEffect } from 'react';
import './MenuBoard.css';
import axios from 'axios';
import revLogo from './rev.png';
import Translate from './components/translate';
import MenuItemScroll from './MenuItemScroll';

const MenuBoard = ({ onPageChange }) => {
    const [menuGroups, setMenuGroups] = useState([]);
    const [marqueeText, setMarqueeText] = useState('WELCOME TO REVS COME CHECK OUT OUR MENU!');

    /**
     * Fetches menu groups and their corresponding menu items from the backend upon component mount.
     */
    useEffect(() => {
        fetchMenuGroups();
    }, []);

    /**
     * Fetches menu groups and their corresponding menu items from the backend.
     */
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

    /**
     * Fetches menu items for a specific menu group from the backend.
     * @param {number} group - The ID of the menu group.
     * @param {string} title - The title of the menu group.
     * @returns {Object} An object containing the title of the menu group and its corresponding menu items.
     */
    const fetchMenuGroup = async (group, title) => {
        try {
            console.log("IM MENUBOARD");
            const response = await axios.post('https://team21revsbackend.onrender.com/api/employee/getmenuitems', { menugroup: group });
            return { title, items: response.data };
        } catch (error) {
            console.error(`Error fetching menu items for group ${group}:`, error);
            return { title, items: [] };
        }
    };

    /**
     * Handles the change of marquee text.
     * @param {Object} event - The input change event.
     */
    const handleMarqueeTextChange = (event) => {
        setMarqueeText(event.target.innerText);
    };

    /**
     * Renders the menu items for each menu group.
     * @returns {JSX.Element} The JSX element representing the menu items.
     */
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