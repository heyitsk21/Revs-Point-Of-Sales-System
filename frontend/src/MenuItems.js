import React, { useState, useEffect } from 'react';
import './MenuItems.css';
import { useTextSize } from './TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests

const MenuItems = ({ onPageChange }) => {
    const [menu, setMenu] = useState([]); // Initialize state for menu items
    const [selectedItem, setSelectedItem] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ id: null, name: '', price: '', ingredients: [] });
    const { textSize, toggleTextSize } = useTextSize();

    // Function to fetch menu items from the backend API
    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/menuitems');
            setMenu(response.data); // Update menu state with response data
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    // Call fetchMenuItems function when component mounts
    useEffect(() => {
        fetchMenuItems();
    }, []);

    const setButtonState = (enabled) => {
        // Implementation of enabling or disabling buttons
    };

    const rowClicked = (event, item) => {
        setSelectedItem(item);
        setCheckedItems(item ? item.ingredients : []);
        setButtonState(true);
    };

    const handleDeleteButtonClick = () => {
        setMenu(prevMenu => prevMenu.filter(item => item.id !== selectedItem.id));
        setSelectedItem(null);
        setCheckedItems([]);
        setButtonState(false);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewMenuItem(prevState => ({ ...prevState, [name]: value }));
    };

    const handleAddMenuItem = () => {
        const newItem = { ...newMenuItem, id: menu.length + 1 };
        setMenu(prevMenu => [...prevMenu, newItem]);
        setNewMenuItem({ id: null, name: '', price: '', ingredients: [] });
    };

    const renderMenuItems = () => {
        return menu.map(item => (
            <tr key={item.menuid} onClick={(event) => rowClicked(event, item)} className={selectedItem && selectedItem.menuid === item.menuid ? 'selected' : ''}>
                <td>{item.menuid}</td>
                <td>{item.itemname}</td>
                <td>${item.price}</td>
            </tr>
        ));
    };

    useEffect(() => {
        if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
            };
        }
    }, []);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className={`manager-menu-items ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="toggle-button-container">
                <button onClick={() => speakText("Menu Items... ID...	Name...	Price... Delete... Add New Menu Item... Name:... Price:... Add... Select a Menu Item to Edit... Trends... Inventory... Menu Items... Order History")}>Speak</button>
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <div className="left-panel">
                <h2>Menu Items</h2>
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderMenuItems()}
                    </tbody>
                </table>
                <div className="button-panel">
                    <button onClick={handleDeleteButtonClick} disabled={!selectedItem}>Delete</button>
                </div>
                <div className="add-item-section">
                    <h2>Add New Menu Item</h2>
                    <label htmlFor="newName">Name:</label>
                    <input type="text" id="newName" name="name" value={newMenuItem.name} onChange={handleInputChange} />
                    <label htmlFor="newPrice">Price:</label>
                    <input type="text" id="newPrice" name="price" value={newMenuItem.price} onChange={handleInputChange} />
                    <button onClick={handleAddMenuItem}>Add</button>
                </div>
            </div>
            <div className="right-panel">
                <h2>{selectedItem ? `Edit Menu Item ${selectedItem.menuid}` : 'Select a Menu Item to Edit'}</h2>
                {selectedItem && (
                    <>
                        <label htmlFor="editName">Name:</label>
                        <input type="text" id="editName" name="name" value={selectedItem.itemname} onChange={handleInputChange} />
                        <label htmlFor="editPrice">Price:</label>
                        <input type="text" id="editPrice" name="price" value={selectedItem.price} onChange={handleInputChange} />
                        <h3>Ingredients:</h3>
                        <ul>
                            {checkedItems.map((ingredient, index) => (
                                <li key={index}>{ingredient}</li>
                            ))}
                        </ul>
                    </>
                )}
            </div>
            <div id="google_translate_element"></div>
            <div className="bottom-nav">
                <button onClick={() => onPageChange('trends')}>Trends</button>
                <button onClick={() => onPageChange('inventory')}>Inventory</button>
                <button onClick={() => onPageChange('menuItems')}>Menu Items</button>
                <button onClick={() => onPageChange('orderHistory')}>Order History</button>
            </div>
        </div>
    );
};

export default MenuItems;
