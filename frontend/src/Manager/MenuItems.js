import React, { useState, useEffect } from 'react';
import './MenuItems.css';
import { useTextSize } from '../components/TextSizeContext';
import axios from 'axios';
import ManagerTopBar from '../components/ManagerTopBar';

function MenuItems() {
    const [menu, setMenu] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [checkedItems, setCheckedItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ category: null, name: '', price: '', ingredients: [] });
    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredient, setSelectedIngredient] = useState('');
    const [selectedCustomization, setSelectedCustomization] = useState('');
    const [customizations, setCustomizations] = useState([]);
    const [highContrast, setHighContrast] = useState(false); // State variable for HighContrast mode
    const { textSize } = useTextSize();

    useEffect(() => {
        fetchMenuItems();
        fetchIngredients();
        fetchCustomizations();
    }, []);

    const fetchMenuItems = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/menuitems');
            setMenu(response.data);
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const fetchIngredients = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/ingredients');
            setIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const fetchCustomizations = async () => {
        try {
            if (selectedItem) {
                const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/menuitemcustomizations', { menuitemid: selectedItem.menuid });
                setCustomizations(response.data);
            }
        } catch (error) {
            console.error('Error fetching customizations:', error);
        }
    };

    const [categories] = useState([
        { value: 100, label: 'Burgers' },
        { value: 200, label: 'Sandwiches' },
        { value: 400, label: 'Desserts' },
        { value: 700, label: 'Limited Time' },
        { value: 500, label: 'Drinks & Fries' },
        { value: 300, label: 'Salads' },
        { value: 600, label: 'Value Meals' }
    ]);

    const handleCategoryChange = (event) => {
        setNewMenuItem({ ...newMenuItem, category: event.target.value });
    };

    const rowClicked = async (event, item) => {
        setSelectedItem(item);
        try {
            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/menuitemingredients', { menuitemid: item.menuid });
            setCheckedItems(response.data);
            await fetchCustomizations();
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };

    const handleDeleteButtonClick = async () => {
        if (!selectedItem) return;
        try {
            await axios.delete('https://team21revsbackend.onrender.com/api/manager/menuitems', { data: { menuid: selectedItem.menuid } });
            setMenu(prevMenu => prevMenu.filter(item => item.menuid !== selectedItem.menuid));
            setSelectedItem(null);
            setCheckedItems([]);
        } catch (error) {
            console.error('Error deleting menu item:', error);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setSelectedItem(prevState => ({
            ...prevState,
            [name]: value
        }));
    };


    const handleUpdateMenuItem = async () => {
        try {
            const payload = {
                menuid: selectedItem.menuid,
                itemname: selectedItem.itemname,
                price: parseFloat(selectedItem.price)
            };

            await axios.put('https://team21revsbackend.onrender.com/api/manager/menuitems', payload);

            fetchMenuItems();
        } catch (error) {
            console.error('Error updating menu item:', error);
        }
    };

    const handleAddMenuItem = async () => {
        try {
            console.log('Name:', newMenuItem.name, 'Type:', typeof newMenuItem.name);
            console.log('Category:', newMenuItem.category, 'Type:', typeof newMenuItem.category);
            console.log('Price:', newMenuItem.price, 'Type:', typeof newMenuItem.price);

            const itemName = newMenuItem.name.toString();

            await axios.post('https://team21revsbackend.onrender.com/api/manager/menuitems', { category: newMenuItem.category, itemname: itemName, price: newMenuItem.price });

            alert('New menu item added successfully.');

            setNewMenuItem({ category: null, name: '', price: '', ingredients: [] });
        }
        catch (error) {
            console.error("Error adding menu item:", error);
        }
        fetchMenuItems();
    };


    const handleIngredientChange = (event) => {
        setSelectedIngredient(event.target.value);
    };

    const handleAddIngredient = async () => {
        try {
            const ingredientId = parseInt(selectedIngredient);
            console.log('Selected Menu Item ID:', selectedItem.menuid);
            console.log('Selected Ingredient ID:', ingredientId);
            await axios.post('https://team21revsbackend.onrender.com/api/manager/menuitemingredients', { menuitemid: selectedItem.menuid, ingredientid: ingredientId });

            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/menuitemingredients', { menuitemid: selectedItem.menuid });
            setCheckedItems(response.data);

        } catch (error) {
            console.error('Error adding ingredient:', error);
        }
    };

    const handleDeleteIngredient = async (ingredientIdToDelete) => {
        try {
            await axios.delete('https://team21revsbackend.onrender.com/api/manager/menuitemingredients', {
                data: {
                    menuitemid: selectedItem.menuid,
                    ingredientid: ingredientIdToDelete
                }
            });

            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/menuitemingredients', { menuitemid: selectedItem.menuid });
            setCheckedItems(response.data);

        } catch (error) {
            console.error('Error deleting ingredient:', error);
        }
    };

    const handleAddCustomization = async (customizationId) => {
        try {
            const payload = { menuitemid: selectedItem.menuid, customizationid: Number(customizationId) };
            await axios.post('https://team21revsbackend.onrender.com/api/manager/menuitemcustomizations', payload);
            fetchCustomizations();
        } catch (error) {
            console.error('Error adding customization:', error);
        }
    };

    const handleDeleteCustomization = async (customizationId) => {
        try {
            console.log('Customization ID:', customizationId); // Logging the value inside the function
            const payload = { menuitemid: selectedItem.menuid, customizationid: Number(customizationId) };
            console.log('Delete Payload:', payload); // Logging the payload
            await axios.delete(`https://team21revsbackend.onrender.com/api/manager/menuitemcustomizations`, { data: payload });
            fetchCustomizations();
        } catch (error) {
            console.error('Error deleting customization:', error);
        }
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

    const renderIngredientOptions = () => {
        return ingredients.map(ingredient => (
            <option key={ingredient.ingredientid} value={ingredient.ingredientid}>{ingredient.ingredientname}</option>
        ));
    };
    
    const renderCustomizations = () => {
        console.log('Customizations:', customizations);
        return customizations.map(customization => (
            <div key={customization.customizationid}>
                {customization.customizationname} - {customization.ingredientname}
                <button className='menu-item-button' onClick={() => handleDeleteCustomization(customization.ingredientid)}><img src="/Images/deleteIcon.png" alt="Delete" className="delete-icon" /></button>
            </div>
        ));
    };

    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
    };

    return (
        <div className={`manager-menu ${textSize === 'large' ? 'large-text' : ''} ${highContrast ? 'high-contrast' : ''}`}>
            <ManagerTopBar toggleHighContrast={toggleHighContrast} />
            <div className='manager-menu-items'>
                <div className="add-item-section">
                    <h2>Add New Menu Item</h2>
                    <div className='add-item-object'>
                        <label>Item Name:</label>
                        <input className='menu-item-input'
                            type="text"
                            value={newMenuItem.name}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                        />
                    </div>
                    <div className='add-item-object'>
                        <label>Price:</label>
                        <input className='menu-item-input'
                            type="number"
                            value={newMenuItem.price}
                            onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                        />
                    </div>
                    <div className='add-item-object'>
                        <label>Category:</label>
                        <select className='menu-item-input'
                            value={newMenuItem.category}
                            onChange={handleCategoryChange}
                        >
                            <option value="">Select Category</option>
                            {categories.map(category => (
                                <option key={category.value} value={category.value}>
                                    {category.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    <button className='menu-item-button' onClick={handleAddMenuItem}>Submit</button>
                </div>
                <div className="edit-item-section">
                    <h2>{selectedItem ? `Edit Menu Item ${selectedItem.menuid}` : 'Select a Menu Item to Edit'}</h2>
                    {selectedItem && (
                        <>
                            <label htmlFor="editName">Name:</label>
                            <input type="text" id="editName" name="itemname" value={selectedItem.itemname} onChange={handleInputChange} />
                            <label htmlFor="editPrice">Price:</label>
                            <input type="text" id="editPrice" name="price" value={selectedItem.price} onChange={handleInputChange} />
                            <button className='menu-item-button' onClick={handleUpdateMenuItem}>Update</button>
                            <h3>Ingredients:</h3>
                            <ul>
                                {checkedItems.map((ingredient, index) => (
                                    <li key={index}>
                                        {ingredient.ingredientname}
                                        <button className='menu-item-button-delete' onClick={() => handleDeleteIngredient(ingredient.ingredientid)}><img src="/Images/deleteIcon.png" alt="Delete" className="delete-icon" /></button>
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <h3 htmlFor="ingredientSelect">Add New Ingredient:</h3>
                                <select id="ingredientSelect" value={selectedIngredient} onChange={handleIngredientChange}>
                                    <option value="">Select Ingredient</option>
                                    {renderIngredientOptions()}
                                </select>
                                <button className='menu-item-button-delete' onClick={handleAddIngredient}><img src="/Images/addIcon.png" alt="Add" className="delete-icon" /></button>
                            </div>
                            <h3>Customizations:</h3>
                            <div>
                                {renderCustomizations()}
                            </div>
                            <div className="edit-customization-section">
                                <h3 htmlFor="customizationSelect">Add Customization:</h3>
                                <select id="customizationSelect" value={selectedCustomization} onChange={(e) => setSelectedCustomization(e.target.value)}>
                                    <option value="">Select Customization</option>
                                    {renderIngredientOptions()}
                                </select>
                                <button className='menu-item-button' onClick={() => handleAddCustomization(selectedCustomization)}><img src="/Images/addIcon.png" alt="Add" className="delete-icon" /></button>
                            </div>
                        </>
                    )}
                </div>
                <div className='item-list'>
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
                </div>
                <div className="button-panel">
                    <button className='menu-item-button' onClick={handleDeleteButtonClick} disabled={!selectedItem}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default MenuItems;
