// Filename: App.js


import React ,{useEffect,useState}from 'react';
import axios from 'axios';
import Popup from 'reactjs-popup';


export default function Restock() {
    const [ingredients, setIngredients] = useState([]);
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
	return (
		<div>
			<Popup trigger=
				{<button> Restock</button>} 
				modal nested>
				{
					close => (
						<div className='modal'>
							<div className='content'>
                                Restock HTML here
							</div>
							<div>
								<button onClick=
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
