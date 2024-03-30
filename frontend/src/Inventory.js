import React, { useState, useEffect } from 'react';
import './Inventory.css'; 
import { useTextSize } from './TextSizeContext'; 
import axios from 'axios'; // Import Axios for making API requests

const Inventory = ({ onPageChange }) => {
    const [inventory, setInventory] = useState([]); 
    const [selectedItem, setSelectedItem] = useState(null); 
    const { textSize, toggleTextSize } = useTextSize(); 

    // Function to fetch inventory data from the backend API
    const fetchInventory = async () => {
        try {
            const response = await axios.get('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/ingredients');
            setInventory(response.data); // Update inventory state with response data
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    const handleItemSelected = (item) => {
        setSelectedItem(item);
    };

    const handleItemUpdate = async (itemId, updatedData) => {
        try {
            const response = await axios.put(`https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/editingredient/${itemId}`, updatedData);
            console.log('Item updated successfully:', response.data);
            // Update inventory after successful update
            fetchInventory();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const renderInventoryItems = () => {
        return inventory.map(item => (
            <div key={item.ingredientid} className="inventory-item" onClick={() => handleItemSelected(item)}>
                <span>{item.ingredientname}</span>
                <span>Price Per Unit: ${item.ppu}</span>
                <span>Count: {item.count}</span>
                <span>Min Amount: {item.minamount}</span>
            </div>
        ));
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        fetchInventory();
    }, []); // Empty dependency array ensures useEffect runs only once on component mount

    return (
        <div className={`inventory ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="toggle-button-container">
                <button onClick={() => speakText("Inventory Items... Selected Item Details... Trends... Inventory... Menu Items... Order History... ")}>Speak</button>
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <div className="inventory-list">
                <h2>Inventory Items</h2>
                {renderInventoryItems()}
            </div>
            <div className="inventory-details">
                <h2>Selected Item Details</h2>
                {selectedItem && (
                    <div className="selected-item">
                        <h3>{selectedItem.ingredientname}</h3>
                        <div>
                            <label>Price Per Unit:</label>
                            <input
                                type="number"
                                value={selectedItem.ppu}
                                onChange={(e) => handleItemUpdate(selectedItem.ingredientid, { ppu: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Count:</label>
                            <input
                                type="number"
                                value={selectedItem.count}
                                onChange={(e) => handleItemUpdate(selectedItem.ingredientid, { count: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Min Amount:</label>
                            <input
                                type="number"
                                value={selectedItem.minamount}
                                onChange={(e) => handleItemUpdate(selectedItem.ingredientid, { minamount: e.target.value })}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div className="bottom-nav">
                <button onClick={() => onPageChange('trends')}>Trends</button>
                <button onClick={() => onPageChange('inventory')}>Inventory</button>
                <button onClick={() => onPageChange('menuItems')}>Menu Items</button>
                <button onClick={() => onPageChange('orderHistory')}>Order History</button>
            </div>
        </div>
    );
};

export default Inventory;
