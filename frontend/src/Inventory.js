import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { useTextSize } from './components/TextSizeContext';
import axios from 'axios';
import ManagerTopBar from './components/ManagerTopBar';
import ManagerBottomBar from './components/ManagerBottomBar';

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
    const [speakEnabled] = useState(false);
    const { textSize } = useTextSize();

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

    const handleItemUpdate = async () => {
        try {
            const payload = {
                ingredientid: selectedItem.ingredientid,
                ingredientname: selectedItem.ingredientname,
                count: parseInt(selectedItem.count),
                ppu: parseFloat(selectedItem.ppu),
                minamount: parseFloat(selectedItem.minamount)
            };

            await axios.put('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/ingredients', payload);
            
            fetchInventory();
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };

    const handleIngredientSubmit = async () => {
        try {
            const response = await axios.post('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/ingredients', newIngredient);
            console.log('Ingredient added successfully:', response.data);
            fetchInventory();
        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setSelectedItem(prevState => ({
            ...prevState,
            [field]: value
        }));
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

    useEffect(() => {
        fetchInventory();
    }, []);

    return (
        <div className={`inventory ${textSize === 'large' ? 'large-text' : ''}`}>
            <ManagerTopBar />
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
                                onChange={(e) => handleInputChange(e, 'ppu')}
                            />
                        </div>
                        <div>
                            <label>Count:</label>
                            <input
                                type="number"
                                value={selectedItem.count}
                                onChange={(e) => handleInputChange(e, 'count')}
                            />
                        </div>
                        <div>
                            <label>Min Amount:</label>
                            <input
                                type="number"
                                value={selectedItem.minamount}
                                onChange={(e) => handleInputChange(e, 'minamount')}
                            />
                        </div>
                        <button onClick={handleItemUpdate}>Submit</button>
                    </div>
                )}
            </div>
            <div className="new-ingredient">
                <h2>Add New Ingredient</h2>
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
                <button onClick={handleIngredientSubmit}>Submit</button>
            </div>

            <div className="inventory-list">
                <h2>Inventory Items</h2>
                {renderInventoryItems()}
            </div>
            <ManagerBottomBar onPageChange={onPageChange} />
        </div>
    );
};

export default Inventory;
