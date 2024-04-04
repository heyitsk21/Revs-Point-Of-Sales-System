import React, { useState, useEffect } from 'react';
import './MenuItems.css';
import { useTextSize } from './components/TextSizeContext';
import axios from 'axios';
import ManagerTopBar from './components/ManagerTopBar';
import ManagerBottomBar from './components/ManagerBottomBar';

const MenuItems = ({ onPageChange }) => {
    const [menu, setMenu] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ id: null, name: '', price: '', ingredients: [] });
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [speakEnabled] = useState(false);
    const { textSize } = useTextSize();

    useEffect(() => {
        fetchMenuItems();
        fetchIngredients();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/menuitems');
            setMenu(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const fetchIngredients = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/manager/ingredients');
            setIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const rowClicked = async (event, item) => {
        setSelectedItem(item);
        try {
            const response = await axios.put('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/menuitemingredients', { menuitemid: item.menuid });
            setCheckedItems(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const handleDeleteButtonClick = () => {
        setMenu(prevMenu => prevMenu.filter(item => item.id !== selectedItem.id));
        setSelectedItem(null);
        setCheckedItems([]);
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

    const handleIngredientChange = (event) => {
        setSelectedIngredient(event.target.value);
    };

    const handleAddIngredient = async () => {
        try {
            await axios.post('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/menuitemingredients', { menuitemid: selectedItem.menuid, ingredientid: selectedIngredient });
        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    };

    const renderMenuItems = () => {
        return menu.map(item => (
            <tr key={item.menuid} onClick={(event) => rowClicked(event, item)} className={selectedItem && selectedItem.menuid === item.menuid ? 'selected' : ''}>
                <td onMouseOver={handleMouseOver}>{item.menuid}</td>
                <td onMouseOver={handleMouseOver}>{item.itemname}</td>
                <td onMouseOver={handleMouseOver}>${item.price}</td>
            </tr>
        ));
    };

    const renderIngredientOptions = () => {
        return ingredients.map(ingredient => (
            <option key={ingredient.ingredientid} value={ingredient.ingredientid}>{ingredient.ingredientname}</option>
        ));
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

    return (
        <div className={`manager-menu ${textSize === 'large' ? 'large-text' : ''}`} onMouseOver={handleMouseOver}>
            <div><ManagerTopBar/></div>
            <div className='manager-menu-items'>
                <div className="left-panel">
                    <div className="add-item-section">
                        <h2 onMouseOver={handleMouseOver}>Add New Menu Item</h2>
                        <label htmlFor="newName" onMouseOver={handleMouseOver}>Name:</label>
                        <input type="text" id="newName" name="name" value={newMenuItem.name} onChange={handleInputChange} onMouseOver={handleMouseOver} />
                        <label htmlFor="newPrice" onMouseOver={handleMouseOver}>Price:</label>
                        <input type="text" id="newPrice" name="price" value={newMenuItem.price} onChange={handleInputChange} onMouseOver={handleMouseOver} />
                        <button onClick={handleAddMenuItem} onMouseOver={handleMouseOver}>Add</button>
                    </div>
                </div>
                <div className="right-panel">
                    <h2 onMouseOver={handleMouseOver}>{selectedItem ? `Edit Menu Item ${selectedItem.menuid}` : 'Select a Menu Item to Edit'}</h2>
                    {selectedItem && (
                        <>
                            <label htmlFor="editName" onMouseOver={handleMouseOver}>Name:</label>
                            <input type="text" id="editName" name="name" value={selectedItem.itemname} onChange={handleInputChange} onMouseOver={handleMouseOver} />
                            <label htmlFor="editPrice" onMouseOver={handleMouseOver}>Price:</label>
                            <input type="text" id="editPrice" name="price" value={selectedItem.price} onChange={handleInputChange} onMouseOver={handleMouseOver} />
                            <h3 onMouseOver={handleMouseOver}>Ingredients:</h3>
                            <ul>
                                {checkedItems.map((ingredient, index) => (
                                    <li key={index} onMouseOver={handleMouseOver}>{ingredient.ingredientname}</li>
                                ))}
                            </ul>
                            <div>
                                <h3 htmlFor="ingredientSelect" onMouseOver={handleMouseOver}>Add New Ingredient:</h3>
                                <select id="ingredientSelect" value={selectedIngredient} onChange={handleIngredientChange} onMouseOver={handleMouseOver}>
                                    <option value="">Select Ingredient</option>
                                    {renderIngredientOptions()}
                                </select>
                                <button onClick={handleAddIngredient} onMouseOver={handleMouseOver}>Add</button>
                            </div>
                        </>
                    )}
                </div>
                <h2 onMouseOver={handleMouseOver}>Menu Items</h2>
                <table>
                    <thead>
                        <tr>
                            <th onMouseOver={handleMouseOver}>ID</th>
                            <th onMouseOver={handleMouseOver}>Name</th>
                            <th onMouseOver={handleMouseOver}>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderMenuItems()}
                    </tbody>
                </table>
                <div className="button-panel">
                    <button onClick={handleDeleteButtonClick} disabled={!selectedItem} onMouseOver={handleMouseOver}>Delete</button>
                </div>
            </div>
            <ManagerBottomBar onPageChange={onPageChange} />
        </div>
    );
};

export default MenuItems;
