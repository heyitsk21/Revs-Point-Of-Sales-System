import React, { useState, useEffect } from 'react';
import './Inventory.css';
import { useTextSize } from '../components/TextSizeContext';
import axios from 'axios';
import ManagerTopBar from '../components/ManagerTopBar';
import ManagerBottomBar from '../components/ManagerBottomBar';

function Inventory() {
    const [inventory, setInventory] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [newIngredient, setNewIngredient] = useState({
        ingredientid: 0,
        ingredientname: "",
        count: 0,
        ppu: 0,
        minamount: 0,
        location: "",
        recommendedamount: 0,
        caseamount: 0
    });
    const [speakEnabled] = useState(false);
    const { textSize } = useTextSize();

    const fetchInventory = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/ingredients');
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
                minamount: parseFloat(selectedItem.minamount),
                location: selectedItem.location,
                recommendedamount: selectedItem.recommendedamount,
                caseamount: selectedItem.caseamount
            };
    
            await axios.put('https://team21revsbackend.onrender.com/api/manager/ingredients', payload);
            alert('Ingredient edited successfully:');
            fetchInventory();
        } catch (error) {
            console.error('Error updating ingredient:', error);
        }
    };

    const handleIngredientSubmit = async () => {
        try {
            const newIngredientData = {
                ...newIngredient,
                count: parseInt(newIngredient.count),
                ppu: parseFloat(newIngredient.ppu),
                minamount: parseFloat(newIngredient.minamount),
                recommendedamount: parseInt(newIngredient.recommendedamount),
                caseamount: parseInt(newIngredient.caseamount)
            };
    
            const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/ingredients', newIngredientData);
            alert('Ingredient added successfully:');
            fetchInventory();
            setNewIngredient({
                ingredientid: 0,
                ingredientname: "",
                count: 0,
                ppu: 0,
                minamount: 0,
                location: "",
                recommendedamount: 0,
                caseamount: 0
            });
        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    };

    const handleIngredientDelete = async (itemId, deleteCount) => {
        if (window.confirm("Are you sure you want to delete this ingredient?")) {
            try {
                const response = await axios.delete('https://team21revsbackend.onrender.com/api/manager/ingredients', { data: { ingredientid: itemId, count: deleteCount } });
                alert('Item deleted successfully:');
                fetchInventory();
            } catch (error) {
                console.error('Error deleting item:', error);
            }
        }
    };

    const handleInputChange = (e, field) => {
        const value = e.target.value;
        setSelectedItem(prevState => ({
            ...prevState,
            [field]: value
        }));
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

    const renderInventoryItems = () => {
        return inventory.map(item => (
            <div key={item.ingredientid} className="inventory-item" onClick={() => handleItemSelected(item)}>
                <span>{item.ingredientname}</span>
                <span>Price Per Unit: ${item.ppu}</span>
                <span>Count: {item.count}</span>
                <span>Min Amount: {item.minamount}</span>
                <span>Location: {item.location}</span>
                <span>Recommended Amount: {item.recommendedamount}</span>
                <span>Case Amount: {item.caseamount}</span>
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
                        <div>
                            <label>location:</label>
                            <input
                                type="text"
                                value={selectedItem.location}
                                onChange={(e) => handleInputChange(e, 'location')}
                            />
                        </div>
                        <div>
                            <label>Recommended Amount:</label>
                            <input
                                type="number"
                                value={selectedItem.recommendedamount}
                                onChange={(e) => handleInputChange(e, 'recommendedamount')}
                            />
                        </div>
                        <div>
                            <label>Case Amount:</label>
                            <input
                                type="number"
                                value={selectedItem.caseamount}
                                onChange={(e) => handleInputChange(e, 'caseamount')}
                            />
                        </div>
                        <button onClick={handleItemUpdate}>Submit</button>
                        <button onClick={() => handleIngredientDelete(selectedItem.ingredientid, selectedItem.count)}>Delete</button>
                    </div>
                )}
            </div>
            <div className="new-ingredient">
                <h2>Add New Ingredient</h2>
                <div className='new-ingredient-user'>
                    <label>Ingredient Name:</label>
                    <input
                        type="text"
                        value={newIngredient.ingredientname}
                        onChange={(e) => setNewIngredient({ ...newIngredient, ingredientname: e.target.value })}
                    />
                </div>
                <div className='new-ingredient-user'>
                    <label>Price Per Unit:</label>
                    <input
                        type="number"
                        value={newIngredient.ppu}
                        onChange={(e) => setNewIngredient({ ...newIngredient, ppu: e.target.value })}
                    />
                </div>
                <div className='new-ingredient-user'>
                    <label>Count:</label>
                    <input
                        type="number"
                        value={newIngredient.count}
                        onChange={(e) => setNewIngredient({ ...newIngredient, count: e.target.value })}
                    />
                </div>
                <div className='new-ingredient-user'>
                    <label>Min Amount:</label>
                    <input
                        type="number"
                        value={newIngredient.minamount}
                        onChange={(e) => setNewIngredient({ ...newIngredient, minamount: e.target.value })}
                    />
                </div>
                <div className='new-ingredient-user'>
                    <label>Location:</label>
                    <input
                        type="text"
                        value={newIngredient.location}
                        onChange={(e) => setNewIngredient({ ...newIngredient, location: e.target.value })}
                    />
                </div>
                <div className='new-ingredient-user'>
                    <label>Recommended Amount:</label>
                    <input
                        type="number"
                        value={newIngredient.recommendedamount}
                        onChange={(e) => setNewIngredient({ ...newIngredient, recommendedamount: e.target.value })}
                    />
                </div>
                <div className='new-ingredient-user'>
                    <label>Case Amount:</label>
                    <input
                        type="number"
                        value={newIngredient.caseamount}
                        onChange={(e) => setNewIngredient({ ...newIngredient, caseamount: e.target.value })}
                    />
                </div>
                <button onClick={handleIngredientSubmit}>Submit</button>
            </div>

            <div className="inventory-list">
                <h2>Inventory Items</h2>
                {renderInventoryItems()}
            </div>
            <ManagerBottomBar />
        </div>
    );
};

export default Inventory;
