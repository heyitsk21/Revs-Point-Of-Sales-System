import React, { useState, useEffect } from 'react';
import './MenuItems.css'; // Import CSS file for styling
import { useTextSize } from './TextSizeContext'; // Import the useTextSize hook

const MenuItems = ({ onPageChange }) => {
    // Example menu item
    const exampleMenuItem = {
        id: 1,
        name: 'Cheeseburger',
        price: 9.99,
        ingredients: ['Beef patty', 'Cheese', 'Lettuce', 'Tomato', 'Onion', 'Pickles', 'Bun']
    };

    // State variables for UI components
    const [menu, setMenu] = useState([exampleMenuItem]); // State to store menu items
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected menu item
    const [checkedItems, setCheckedItems] = useState([]); // State to store checked ingredients
    const [newMenuItem, setNewMenuItem] = useState({ id: null, name: '', price: '', ingredients: [] }); // State to store new menu item data
    const { textSize, toggleTextSize } = useTextSize(); // Get textSize and toggleTextSize from context

    // Helper function to enable or disable buttons based on the provided boolean value
    const setButtonState = (enabled) => {
        // Implementation of enabling or disabling buttons
    };

    // Function to handle row selection in the menu table
    const rowClicked = (event, item) => {
        setSelectedItem(item);
        setCheckedItems(item ? item.ingredients : []);
        setButtonState(true);
    };

    // Function to handle the "Delete" button click event
    const handleDeleteButtonClick = () => {
        setMenu(prevMenu => prevMenu.filter(item => item.id !== selectedItem.id));
        setSelectedItem(null);
        setCheckedItems([]);
        setButtonState(false);
    };

    // Function to handle input changes for new menu item
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewMenuItem(prevState => ({ ...prevState, [name]: value }));
    };

    // Function to handle adding a new menu item
    const handleAddMenuItem = () => {
        const newItem = { ...newMenuItem, id: menu.length + 1 };
        setMenu(prevMenu => [...prevMenu, newItem]);
        setNewMenuItem({ id: null, name: '', price: '', ingredients: [] });
    };

    // Function to render menu items in the table
    const renderMenuItems = () => {
        return menu.map(item => (
            <tr key={item.id} onClick={(event) => rowClicked(event, item)} className={selectedItem && selectedItem.id === item.id ? 'selected' : ''}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
            </tr>
        ));
    };

    // Load Google Translate when component mounts
    useEffect(() => {
        // Check if Google Translate API is already loaded
        if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);

            // Initialize Google Translate button
            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
            };
        }
    }, []);

    // Function to speak text using text-to-speech API
    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className={`manager-menu-items ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="toggle-button-container">
                {/* Button to speak out "MenuItems" */}
                <button onClick={() => speakText("Menu Items... ID...	Name...	Price... Delete... Add New Menu Item... Name:... Price:... Add... Select a Menu Item to Edit... Trends... Inventory... Menu Items... Order History")}>Speak</button>
                {/* Button to toggle text size */}
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            {/* Left panel with menu items table */}
            <div className="left-panel">
                <h2>Menu Items</h2>
                {/* Table for displaying menu items */}
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
                {/* Buttons for interaction */}
                <div className="button-panel">
                    <button onClick={handleDeleteButtonClick} disabled={!selectedItem}>Delete</button>
                </div>
                {/* Add new menu item section */}
                <div className="add-item-section">
                    <h2>Add New Menu Item</h2>
                    <label htmlFor="newName">Name:</label>
                    <input type="text" id="newName" name="name" value={newMenuItem.name} onChange={handleInputChange} />
                    <label htmlFor="newPrice">Price:</label>
                    <input type="text" id="newPrice" name="price" value={newMenuItem.price} onChange={handleInputChange} />
                    <button onClick={handleAddMenuItem}>Add</button>
                </div>
            </div>
            {/* Right panel for editing */}
            <div className="right-panel">
                <h2>{selectedItem ? `Edit Menu Item ${selectedItem.id}` : 'Select a Menu Item to Edit'}</h2>
                {selectedItem && (
                    <>
                        <label htmlFor="editName">Name:</label>
                        <input type="text" id="editName" name="name" value={selectedItem.name} onChange={handleInputChange} />
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
            {/* Google Translate button */}
            <div id="google_translate_element"></div>
            {/* Bottom navigation */}
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
