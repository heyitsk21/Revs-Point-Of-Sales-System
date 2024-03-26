import React, { useState, useEffect } from 'react';
import './Inventory.css'; // Import CSS file for styling

const Inventory = ({ onPageChange }) => {
    const [inventory, setInventory] = useState([]); // State to store inventory items
    const [selectedItem, setSelectedItem] = useState(null); // State to store the selected inventory item

    // Function to format the inventory data for display
    const formatInventory = () => {
        // Simulate retrieving inventory information
        const myInventory = [
            { id: 1, name: 'Item 1', pricePerUnit: 10.99, count: 50, minAmount: 10 },
            { id: 2, name: 'Item 2', pricePerUnit: 5.99, count: 100, minAmount: 20 },
        ];
        setInventory(myInventory);
    };

    // Function to handle the event when an inventory item is selected
    const handleItemSelected = (item) => {
        setSelectedItem(item);
    };

    // Function to handle the event when the user updates an inventory item
    const handleItemUpdate = (itemId, updatedData) => {
        // Update the inventory item with the new data
        const updatedInventory = inventory.map(item =>
            item.id === itemId ? { ...item, ...updatedData } : item
        );
        setInventory(updatedInventory);
    };

    // Function to render the inventory items
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

    useEffect(() => {
        // Call the formatInventory function to initialize inventory data
        formatInventory();
    }, []); // Empty dependency array ensures this effect runs only once on mount

    return (
        <div className="inventory">
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

export default Inventory;
