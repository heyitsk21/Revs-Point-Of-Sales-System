import React, { useState, useEffect, useCallback } from 'react';
import './Ordering.css';
import { useCart } from "react-use-cart";
import { useTextSize } from '../../../components/TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests
import Cart from '../Cart/Cart'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

let curr_url = window.location.href;
console.log(curr_url);
if (curr_url == 'https://project-3-full-stack-agile-web-team-21-2.onrender.com/customer' || curr_url == 'http://localhost:3000/customer') {
    import('./CustOrdering.css');
} else if (curr_url == 'https://project-3-full-stack-agile-web-team-21-2.onrender.com/employee' || curr_url == 'http://localhost:3000/employee') {
    import('./Ordering.css');
}

const Ordering = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    const [category, setCategory] = useState('Value Meals');
    const [selectedMenuSection] = useState(null);  //setSelectedMenuSection
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [burgerList, setBurgerList] = useState([]);
    const [sandwichList, setSandwichList] = useState([]);
    const [saladList, setSaladList] = useState([]);
    const [dessertList, setDessertList] = useState([]);
    const [drinksList, setDrinksList] = useState([]);
    const [valueList, setValueList] = useState([]);
    const [limitedList, setLimitedList] = useState([]);

    const {addItem} = useCart();
    console.log('Cart Hook:', useCart());

    const fetchMenuSection = async (currentIdStart) => {
        try {
            const response = await axios.post('https://team21revsbackend.onrender.com/api/employee/getmenuitems',  { menugroup: currentIdStart });
            switch (currentIdStart) {
                case 100:
                    setBurgerList(response.data);
                    break;
                case 200:
                    setSandwichList(response.data);
                    break;
                case 300:
                    setSaladList(response.data);
                    break;
                case 400:
                    setDessertList(response.data);
                    break;
                case 500:
                    setDrinksList(response.data);
                    break;
                case 600:
                    setValueList(response.data);
                    break;
                case 700:
                    setLimitedList(response.data);
                    break;
                default:
                    break;
            }
        } catch (error) {
            console.error('Error fetching menu items:', error);
        }
    };

    const fetchMenuSectionsPeriodically = useCallback(() => {
        fetchMenuSection(100); // Fetch Burger menu items
        fetchMenuSection(200); // Fetch Sandwiches menu items
        fetchMenuSection(300);
        fetchMenuSection(400);
        fetchMenuSection(500);
        fetchMenuSection(600);
        fetchMenuSection(700);
    }, []);

    useEffect(() => {
        if (!initialFetchDone) {
            fetchMenuSectionsPeriodically(); // Fetch menu sections initially
            setInitialFetchDone(true);
        }
        const intervalId = setInterval(fetchMenuSectionsPeriodically, 2 * 60 * 1000); // Fetch menu sections every 2 minutes
        return () => clearInterval(intervalId); // Clear interval on component unmount
    }, [fetchMenuSectionsPeriodically, initialFetchDone]);

    const handleCategories = (categoryName, currentIdStart) => {
        fetchMenuSection(currentIdStart); // Fetch menu section immediately when category is changed
        setCategory(categoryName);
    };

    const renderMenuSection = () => {
        let selectedList;
        switch (category) {
            case 'Burgers':
                selectedList = burgerList;
                break;
            case 'Sandwiches':
                selectedList = sandwichList;
                break;
            case 'Salads':
                selectedList = saladList;
                break;
            case 'Desserts':
                selectedList = dessertList;
                break;
            case 'Drinks & Fries':
                selectedList = drinksList;
                break;
            case 'Value Meals':
                selectedList = valueList;
                break;
            case 'Limited Time':
                selectedList = limitedList;
                break;
            default:
                break;
        }

        if (selectedList) { 
            return selectedList.map(menuitem => (
                <button className='employee-item-button' onClick={() => { console.log('Adding item:', menuitem); addItem({ id: menuitem.menuid, name: menuitem.itemname, price: menuitem.price });}}>
                    <div>{menuitem.itemname}</div>
                    <div>${menuitem.price}</div>
                </button>
            ));
        }
        else {
            return null;
        }
    };	  

    return (
        <div className={`Ordering ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="employee-middle-content">
                <div className="employee-leftSide">
                    <div className='employee-categoryName'>
                        {category}
                    </div>
                    <div className='employee-items'>
                        {renderMenuSection()}
                    </div>
                </div>
                <div className="employee-rightSide">
                    <Cart />
                </div>                    
            </div>

            <div className="employee-bottom-nav">
                <button className='employee-category-button' onClick={() => handleCategories('Value Meals')}>Value Meals</button>
                <button className='employee-category-button' onClick={() => handleCategories('Burgers')}>Burgers</button>
                <button className='employee-category-button' onClick={() => handleCategories('Sandwiches')}>Sandwiches</button>
                <button className='employee-category-button' onClick={() => handleCategories('Salads')}>Salads</button>
                <button className='employee-category-button' onClick={() => handleCategories('Desserts')}>Desserts</button>
                <button className='employee-category-button' onClick={() => handleCategories('Drinks & Fries')}>Drinks & Fries</button>
                <button className='employee-category-button' onClick={() => handleCategories('Limited Time')}>Limited Time</button>
            </div>
        </div>
    );
};

export default Ordering;
