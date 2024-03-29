import React, { useState, useEffect } from 'react';
import './Inventory.css'; 
import { useTextSize } from '../TextSizeContext'; 

const Inventory = ({ onPageChange }) => {
    const [inventory, setInventory] = useState([]); 
    const [selectedItem, setSelectedItem] = useState(null); 
    const { textSize, toggleTextSize } = useTextSize(); 

    const formatInventory = () => {
        const myInventory = [
            { id: 1, name: 'Item 1', pricePerUnit: 10.99, count: 50, minAmount: 10 },
            { id: 2, name: 'Item 2', pricePerUnit: 5.99, count: 100, minAmount: 20 },
        ];
        setInventory(myInventory);
    };

    const handleItemSelected = (item) => {
        setSelectedItem(item);
    };

    const handleItemUpdate = (itemId, updatedData) => {
        setInventory(prevInventory => prevInventory.map(item =>
            item.id === itemId ? { ...item, ...updatedData } : item
        ));
    };

    const renderInventoryItems = () => {
        return inventory.map(item => (
            <div key={item.id} className="inventory-item" onClick={() => handleItemSelected(item)}>
                <span>{item.name}</span>
                <span>Price Per Unit: ${item.pricePerUnit}</span>
                <span>Count: {item.count}</span>
                <span>Min Amount: {item.minAmount}</span>
            </div>
        ));
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    useEffect(() => {
        formatInventory();
    }, []);

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
                        <h3>{selectedItem.name}</h3>
                        <div>
                            <label>Price Per Unit:</label>
                            <input
                                type="number"
                                value={selectedItem.pricePerUnit}
                                onChange={(e) => handleItemUpdate(selectedItem.id, { pricePerUnit: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Count:</label>
                            <input
                                type="number"
                                value={selectedItem.count}
                                onChange={(e) => handleItemUpdate(selectedItem.id, { count: e.target.value })}
                            />
                        </div>
                        <div>
                            <label>Min Amount:</label>
                            <input
                                type="number"
                                value={selectedItem.minAmount}
                                onChange={(e) => handleItemUpdate(selectedItem.id, { minAmount: e.target.value })}
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
