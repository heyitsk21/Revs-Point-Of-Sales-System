import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { useTextSize } from './TextSizeContext';
import axios from 'axios';

const Inventory = ({ onPageChange }) => {
    const [inventory, setInventory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newIngredient, setNewIngredient] = useState({
        ingredientid: 0,
        ingredientname: "",
        count: 0,
        ppu: 0,
        minamount: 0
    });
    const [speakEnabled, setSpeakEnabled] = useState(false);
    const { textSize, toggleTextSize } = useTextSize();

    const fetchInventory = async () => {
        try {
            const response = await axios.get('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/ingredients');
            setInventory(response.data);
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
            fetchInventory();
        } catch (error) {
            console.error('Error updating item:', error);
        }
    };

    const handleIngredientSubmit = async () => {
        try {
            // Convert count, ppu, and minamount to numbers
            const newIngredientData = {
                ...newIngredient,
                count: parseInt(newIngredient.count),
                ppu: parseFloat(newIngredient.ppu),
                minamount: parseFloat(newIngredient.minamount)
            };

            const response = await axios.post('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/ingredients', newIngredientData);
            console.log('Ingredient added successfully:', response.data);
            fetchInventory();
        } catch (error) {
            console.error('Error adding ingredient:', error);
            // Handle error and provide feedback to the user
        }
    };


    const handleIngredientDelete = async (itemId) => {
        try {
            const response = await axios.delete('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/ingredients', { data: { ingredientid: itemId } });
            console.log('Item deleted successfully:', response.data);
            fetchInventory();
        } catch (error) {
            console.error('Error deleting item:', error);
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleMouseOver = debounce((event) => {
        let hoveredElementText = '';
        if (speakEnabled) {
            if (event.target.innerText) {
                hoveredElementText = event.target.innerText;
            } else if (event.target.value) {
                hoveredElementText = event.target.value;
            } else if (event.target.getAttribute('aria-label')) {
                hoveredElementText = event.target.getAttribute('aria-label');
            } else if (event.target.getAttribute('aria-labelledby')) {
                const id = event.target.getAttribute('aria-labelledby');
                const labelElement = document.getElementById(id);
                if (labelElement) {
                    hoveredElementText = labelElement.innerText;
                }
            }
            speakText(hoveredElementText);
        }
    }, 1000); 

    const toggleSpeak = () => {
        if (speakEnabled) {
            window.speechSynthesis.cancel();
        }
        setSpeakEnabled(!speakEnabled);
    };

    const renderInventoryItems = () => {
        return inventory.map(item => (
            <div key={item.ingredientid} className="inventory-item" onClick={() => handleItemSelected(item)} onMouseOver={handleMouseOver}>
                <span>{item.ingredientname}</span>
                <span>Price Per Unit: ${item.ppu}</span>
                <span>Count: {item.count}</span>
                <span>Min Amount: {item.minamount}</span>
                <button onClick={(e) => { e.stopPropagation(); handleIngredientDelete(item.ingredientid); }}>Delete</button>
            </div>
        ));
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <div className={`inventory ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="toggle-button-container">
                <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <div className="inventory-list">
                <h2 onMouseOver={handleMouseOver}>Inventory Items</h2>
                {renderInventoryItems()}
            </div>
            <div className="inventory-details">
                <h2 onMouseOver={handleMouseOver}>Selected Item Details</h2>
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
            <div className="new-ingredient">
                <h2 onMouseOver={handleMouseOver}>Add New Ingredient</h2>
                <div>
                    <label>Ingredient Name:</label>
                    <input
                        type="text"
                        value={newIngredient.ingredientname}
                        onChange={(e) => setNewIngredient({ ...newIngredient, ingredientname: e.target.value })}
                    />
                </div>
                <div>
                    <label>Price Per Unit:</label>
                    <input
                        type="number"
                        value={newIngredient.ppu}
                        onChange={(e) => setNewIngredient({ ...newIngredient, ppu: e.target.value })}
                    />
                </div>
                <div>
                    <label>Count:</label>
                    <input
                        type="number"
                        value={newIngredient.count}
                        onChange={(e) => setNewIngredient({ ...newIngredient, count: e.target.value })}
                    />
                </div>
                <div>
                    <label>Min Amount:</label>
                    <input
                        type="number"
                        value={newIngredient.minamount}
                        onChange={(e) => setNewIngredient({ ...newIngredient, minamount: e.target.value })}
                    />
                </div>
                <button onClick={handleIngredientSubmit} onMouseOver={handleMouseOver}>Submit</button>
                <div></div>
            </div>
            <div className="bottom-nav">
                <button onClick={() => onPageChange('trends')} onMouseOver={handleMouseOver}>Trends</button>
                <button onClick={() => onPageChange('inventory')} onMouseOver={handleMouseOver}>Inventory</button>
                <button onClick={() => onPageChange('menuItems')} onMouseOver={handleMouseOver}>Menu Items</button>
                <button onClick={() => onPageChange('orderHistory')} onMouseOver={handleMouseOver}>Order History</button>
            </div>
        </div>
    );
};

export default Inventory;
