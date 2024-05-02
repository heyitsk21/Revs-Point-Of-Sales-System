import React, { useState, useEffect } from 'react';
import './Ordering.css';
import { useCart } from "react-use-cart";
import { useTextSize } from '../../../components/TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests
import Cart from '../Cart/Cart';
// import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

/**
 * Component for employee ordering interface.
 * @param {object} props - Props passed to the component.
 * @param {function} props.onCatChange - Function to handle category change.
 * @returns {JSX.Element} - The JSX element representing the Ordering component.
 */
const Ordering = ({ onCatChange }) => {
    const { textSize } = useTextSize();
    const [category, setCategory] = useState('Value Meals');
    // const [selectedMenuSection] = useState(null);  // setSelectedMenuSection
    // const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [burgerList, setBurgerList] = useState([]);
    const [sandwichList, setSandwichList] = useState([]);
    const [saladList, setSaladList] = useState([]);
    const [dessertList, setDessertList] = useState([]);
    const [drinksList, setDrinksList] = useState([]);
    const [valueList, setValueList] = useState([]);
    const [limitedList, setLimitedList] = useState([]);

    const { addItem } = useCart();

    const fetchMenuSection = async (currentIdStart) => {
        try {
            // console.log("IM ORDERING");
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

    // const fetchMenuSectionsPeriodically = useCallback(() => {
    //     fetchMenuSection(100); // Fetch Burger menu items
    //     fetchMenuSection(200); // Fetch Sandwiches menu items
    //     fetchMenuSection(300);
    //     fetchMenuSection(400);
    //     fetchMenuSection(500);
    //     fetchMenuSection(600);
    //     fetchMenuSection(700);
    // }, []);

    useEffect(() => {
        fetchMenuSection(600);
    }, []);

    // useEffect(() => {
    //     if (!initialFetchDone) {
    //         fetchMenuSectionsPeriodically(); // Fetch menu sections initially
    //         setInitialFetchDone(true);
    //     }
    //     const intervalId = setInterval(fetchMenuSectionsPeriodically, 2 * 60 * 1000); // Fetch menu sections every 2 minutes
    //     return () => clearInterval(intervalId); // Clear interval on component unmount
    // }, [fetchMenuSectionsPeriodically, initialFetchDone]);

    /**
     * Function to handle category change and fetch corresponding menu section.
     * @param {string} categoryName - Name of the category.
     */
    const handleCategories = (categoryName) => {
        fetchMenuSection(getMenuGroupId(categoryName)); // Fetch menu section immediately when category is changed
        setCategory(categoryName);
    };

    /**
     * Function to render menu section based on selected category.
     * @returns {JSX.Element[]} - Array of JSX elements representing menu items.
     */
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
                <div key={menuitem.menuid}>
                    <button className='employee-item-button' onClick={() => { console.log('Adding item:', menuitem); addItem({ id: menuitem.menuid, name: menuitem.itemname, price: menuitem.price, picturepath: menuitem.picturepath });}}>
                        <div>{menuitem.itemname}</div>
                        <div>${menuitem.price}</div>
                    </button>
                </div>
            ));
        } else {
            return null;
        }
    };	  

    /**
     * Function to get menu group ID based on category name.
     * @param {string} categoryName - Name of the category.
     * @returns {number} - ID of the menu group.
     */
    const getMenuGroupId = (categoryName) => {
        switch (categoryName) {
            case 'Value Meals':
                return 600;
            case 'Burgers':
                return 100;
            case 'Sandwiches':
                return 200;
            case 'Salads':
                return 300;
            case 'Desserts':
                return 400;
            case 'Drinks & Fries':
                return 500;
            case 'Limited Time':
                return 700;
            default:
                return 0;
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
