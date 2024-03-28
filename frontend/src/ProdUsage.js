import React, { useState, useEffect } from 'react';
import './ProdUsage.css';
import { useTextSize } from './TextSizeContext';

const ProdUsage = ({ startDate, endDate, onPageChange }) => {
    const [ingredientNames, setIngredientNames] = useState([]);
    const [totalAmountChangedList, setTotalAmountChangedList] = useState([]);
    const { textSize, toggleTextSize } = useTextSize();

    const fetchData = async (startDate, endDate) => {
        try {
            const mockIngredientNames = ["Ingredient A", "Ingredient B", "Ingredient C"];
            const mockTotalAmountChangedList = [100, 200, 150];

            setIngredientNames(mockIngredientNames);
            setTotalAmountChangedList(mockTotalAmountChangedList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate]);

    return (
        <div className={`prod-usage ${textSize === 'large' ? 'large-text' : ''}`}>
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h1>Produce Usage (negative)</h1>
            <div className="chart">
                {ingredientNames.map((ingredientName, index) => (
                    <div key={index} className="bar-container">
                        <div
                            className="bar"
                            style={{ height: `${totalAmountChangedList[index]}px` }}
                        />
                        <span className="label">{ingredientName}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default ProdUsage;
