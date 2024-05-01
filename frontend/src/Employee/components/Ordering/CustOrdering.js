import React, { useState, useEffect, useCallback } from 'react';
import './CustOrdering.css';
import { useCart } from "react-use-cart";
import { useTextSize } from '../../../components/TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests
import CustCart from '../Cart/CustCart'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const CustOrdering = ({ onCatChange }) => {
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
                <React.Fragment key={menuitem.menuid}>
                    <button className='customer-item-button' onClick={() => { console.log('Adding item:', menuitem); addItem({ id: menuitem.menuid, name: menuitem.itemname, price: menuitem.price, picturepath: menuitem.picturepath });}}>
                        <div>
                                <img id='menuitemimage' src={menuitem.picturepath ? menuitem.picturepath : '/default_tamu_dining_logo.jpg'} alt={menuitem.itemname} />
                            </div>
                        <div>{menuitem.itemname}</div>
                        <div>${menuitem.price}</div>
                    </button>
                </React.Fragment>
            ));
            
        }
        else {
            return null;
        }
    };	  

    const btnEmpCatList = document.querySelectorAll('.customer-category-button');
    btnEmpCatList.forEach(btnEmpCat => {
        btnEmpCat.addEventListener('click', () => {
            document.querySelector('.CustOrderingSpecial')?.classList.remove('CustOrderingSpecial');
            btnEmpCat.classList.add('CustOrderingSpecial');
        })
    });
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
                <button className='customer-category-button' onClick={() => handleCategories('Value Meals')}>Value Meals</button>
                <button className='customer-category-button' onClick={() => handleCategories('Burgers')}>Burgers</button>
                <button className='customer-category-button' onClick={() => handleCategories('Sandwiches')}>Sandwiches</button>
                <button className='customer-category-button' onClick={() => handleCategories('Salads')}>Salads</button>
                <button className='customer-category-button' onClick={() => handleCategories('Desserts')}>Desserts</button>
                <button className='customer-category-button' onClick={() => handleCategories('Drinks & Fries')}>Drinks & Fries</button>
                <button className='customer-category-button' onClick={() => handleCategories('Limited Time')}>Limited Time</button>
            </div>
        </div>
    );
};

export default CustOrdering;