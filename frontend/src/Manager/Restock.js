/**
 * React component for managing Restock.
 * @returns {JSX.Element} Restock component
 */
import React ,{useEffect,useState}from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import './Restock.css';

    /**
     * React component for managing ingredient restocking.
     * @returns {JSX.Element} Restock component
     */
    export default function Restock() {
    /**
     * State variable for storing the list of ingredients.
     * @type {Array<Object>} An array containing ingredients data.
     * @function setIngredients Function to update the ingredients data.
     */
    const [ingredients, setIngredients] = useState([]);

    /**
     * State variable for the selected ingredient.
     * @type {string} Represents the selected ingredient.
     * @function setSelectedIngredient Function to update the selected ingredient.
     */
    const [selectedIngredient, setSelectedIngredient] = useState('');

    /**
     * State variable for the selected location.
     * @type {string} Represents the selected location.
     * @function setSelectedLocation Function to update the selected location.
     */
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        fetchIngredients();
    }, []);
    
    /**
     * Handles the change event for selecting an ingredient.
     * @param {Object} event - The change event
     */
    const handleIngredientChange = (event) => {
        setSelectedIngredient(event.target.value);
    };

    /**
     * Handles the change event for selecting a location.
     * @param {Object} event - The change event
     */
    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };

    /**
     * Fetches the list of ingredients from the backend.
     */
    const fetchIngredients = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/ingredients');
            setIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };
    
    /**
     * Renders the options for selecting an ingredient.
     * @returns {JSX.Element[]} Array of JSX Elements representing ingredient options
     */
    const renderIngredientOptions = () => {
        return ingredients.map(ingredient => (
            <option key={ingredient.ingredientid} value={ingredient.ingredientid}>{ingredient.ingredientname}</option>
        ));
    };

    /**
     * Restocks ingredients by item.
     */
    const RestockByItem = async () => {
        try {
            const payload = {
                ingredientids: [parseInt(selectedIngredient)]
            };
            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/restocksome', payload);
            console.log(response.data);
            alert(response.data.message);
        } catch (error) {
            console.error('Error restocking by item:', error);
        }
    };

    /**
     * Restocks all ingredients.
     */
    const RestockAll = async () => {
        try {
            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/restockall');
            console.log(response.data);
            alert(response.data.message);
        } catch (error) {
            console.error('Error restocking by item:', error);
        }
    };

    /**
     * Restocks ingredients by location.
     */
    const RestockByLocation = async () => {
        try {
            const payload = {
                location: selectedLocation
            };
            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/restockbylocation', payload);
            alert(response.data.message);
            console.log(response.data);
        } catch (error) {
            console.error('Error restocking by item:', error);
        }
    };

    return (
        <div>
            <Popup trigger={<button className='restock-open-button'> Restock</button>} modal nested>
                {
                    close => (
                        <div className='restock-button'>
                            <div className='restock-content'>
                                <h3>Restock All</h3>
                                <button className='restock-button' onClick={RestockAll}> Restock All</button>
                                <h3>Restock By Location</h3>
                                <select id="locationSelect" value={selectedLocation} onChange={handleLocationChange}>
                                    <option value="">Select Location</option>
                                    <option value="freezer">Freezer</option>
                                    <option value="fridge">Fridge</option>
                                    <option value="pantry">Pantry</option>
                                </select>
                                <button className='restock-button' onClick={RestockByLocation}> Restock By Location</button>
                                <h3>Restock By Ingredient</h3>
                                <select id="ingredientSelect" value={selectedIngredient} onChange={handleIngredientChange}>
                                    <option value="">Select Ingredient</option>
                                    {renderIngredientOptions()}
                                </select>
                                <button className='restock-button' onClick={RestockByItem}> Restock Single Ingredient</button>
                            </div>
                            <div>
                                <button className='restock-button' onClick={close}> Close</button>
                            </div>
                        </div>
                    )
                }
            </Popup>
        </div>
    );
};