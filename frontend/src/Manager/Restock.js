import React ,{useEffect,useState}from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';
import './Restock.css';



export default function Restock() {
    const [ingredients, setIngredients] = useState([]);
	const [selectedIngredient, setSelectedIngredient] = useState('');
	const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
        fetchIngredients();
    }, []);
	const handleIngredientChange = (event) => {
        setSelectedIngredient(event.target.value);
    };


	const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };


    const fetchIngredients = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/ingredients');
            setIngredients(response.data);
        } catch (error) {
            console.error('Error fetching ingredients:', error);
        }
    };
    const renderIngredientOptions = () => {
        return ingredients.map(ingredient => (
            <option key={ingredient.ingredientid} value={ingredient.ingredientid}>{ingredient.ingredientname}</option>
        ));
    };

	const RestockByItem = async () => {
        try {
			const payload = {
				ingredientids : [parseInt(selectedIngredient)]
			};
            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/restocksome',payload);
            console.log(response.data);
			alert(response.data.message);
        } catch (error) {
            console.error('Error restok by item:', error);
        }
	};

	const RestockAll = async () => {
        try {
            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/restockall');
            console.log(response.data);
			alert(response.data.message);
        } catch (error) {
            console.error('Error restok by item:', error);
        }
	};

	const RestockByLocation = async () => {
        try {
			const payload = {
				location : selectedLocation
			};
            const response = await axios.put('https://team21revsbackend.onrender.com/api/manager/restockbylocation',payload);
			alert(response.data.message);
            console.log(response.data);
        } catch (error) {
            console.error('Error restok by item:', error);
        }
	};

	return (
		<div>
			<Popup trigger=
				{<button className = 'restock-open-button'> Restock</button>} 
				modal nested>
				{
					close => (
						<div className='restock-button'>
							<div className='restock-content'>


							<h3>Restock All</h3>

							<button className='restock-button' onClick={() => RestockAll()}> Restock All</button>

							<h3>Restock By Location</h3>
							<select id="locationSelect"  value={selectedLocation} onChange={handleLocationChange} >
                                    <option value="">Select Location</option>
									<option value="freezer">freezer</option>
									<option value="fridge">fridge</option>
									<option value="pantry">pantry</option>
                                </select>

							<button  className='restock-button' onClick={() => RestockByLocation()}> Restock By Location</button>


							<h3>Restock By Ingredient</h3>
							<select id="ingredientSelect"  value={selectedIngredient} onChange={handleIngredientChange} >
                                    <option value="">Select Ingredient</option>
                                    {renderIngredientOptions()}
                                </select>
								<button className='restock-button' onClick={() => RestockByItem()}> Restock Single Ingredient</button>
							</div>
							<div>
								<button className='restock-button' onClick=
									{() => close()}>
										Close
								</button>
							</div>
						</div>
					)
				}
			</Popup>
		</div>
	)
};