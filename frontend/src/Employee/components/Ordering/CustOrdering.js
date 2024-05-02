import React, { useState, useEffect } from 'react';
import './CustOrdering.css';
import { useCart } from "react-use-cart";
import { useTextSize } from '../../../components/TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests
import CustCart from '../Cart/CustCart';
// import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

/**
 * Component for customer ordering interface.
 * @param {object} props - Props passed to the component.
 * @param {function} props.onCatChange - Function to handle category change.
 * @returns {JSX.Element} - The JSX element representing the CustOrdering component.
 */
const CustOrdering = ({ onCatChange }) => {
    const { textSize } = useTextSize();
    const [category, setCategory] = useState('Value Meals');
    // const [selectedMenuSection] = useState(null);  //setSelectedMenuSection
    // const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [burgerList, setBurgerList] = useState([]);
    const [sandwichList, setSandwichList] = useState([]);
    const [saladList, setSaladList] = useState([]);
    const [dessertList, setDessertList] = useState([]);
    const [drinksList, setDrinksList] = useState([]);
    const [valueList, setValueList] = useState([]);
    const [limitedList, setLimitedList] = useState([]);

    const { addItem } = useCart();

    /**
     * Function to fetch menu items based on menu group ID.
     * @param {number} currentIdStart - ID of the menu group to fetch.
     */
    const fetchMenuSection = async (currentIdStart) => {
        try {
            // console.log("IM CUSTORDERING");
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

    /**
     * Function to handle category change and fetch corresponding menu section.
     * @param {string} categoryName - Name of the category.
     * @param {number} currentIdStart - ID of the menu group to fetch.
     */
    const handleCategories = (categoryName, currentIdStart) => {
        fetchMenuSection(currentIdStart); // Fetch menu section immediately when category is changed
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
                    <button className='customer-item-button' onClick={() => { console.log('Adding item:', menuitem); addItem({ id: menuitem.menuid, name: menuitem.itemname, price: menuitem.price, picturepath: menuitem.picturepath });}}>
                        <div>
                            <img id='menuitemimage' src={menuitem.picturepath ? menuitem.picturepath : '/default_tamu_dining_logo.jpg'} alt={menuitem.itemname} />
                        </div>
                        <div>{menuitem.itemname}</div>
                        <div>${menuitem.price}</div>
                    </button>
                </div>
            ));
        }
        else {
            return null;
        }
    };	  

    return (
        <div className={`Ordering ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="customer-middle-content">
                <div className="customer-leftSide">
                    <div className='customer-categoryName'>
                        {category}
                    </div>
                    <div className='customer-items'>
                        {renderMenuSection()}
                    </div>
                </div>
                <div className="customer-rightSide">
                    <CustCart />
                </div>                    
            </div>
            <div className="customer-bottom-nav">
                <button className='customer-category-button' onClick={() => handleCategories('Value Meals', 600)}>Value Meals</button>
                <button className='customer-category-button' onClick={() => handleCategories('Burgers', 100)}>Burgers</button>
                <button className='customer-category-button' onClick={() => handleCategories('Sandwiches', 200)}>Sandwiches</button>
                <button className='customer-category-button' onClick={() => handleCategories('Salads', 300)}>Salads</button>
                <button className='customer-category-button' onClick={() => handleCategories('Desserts', 400)}>Desserts</button>
                <button className='customer-category-button' onClick={() => handleCategories('Drinks & Fries', 500)}>Drinks & Fries</button>
                <button className='customer-category-button' onClick={() => handleCategories('Limited Time', 700)}>Limited Time</button>
            </div>
        </div>
    );
};

export default CustOrdering;
