import React, { useState, useEffect } from 'react';
import './ProdUsage.css'; // Import CSS file for styling
import { useTextSize } from './TextSizeContext'; // Import the useTextSize hook

const ProdUsage = ({ startDate, endDate, onPageChange }) => {
    const [ingredientNames, setIngredientNames] = useState([]);
    const [totalAmountChangedList, setTotalAmountChangedList] = useState([]);
    const { textSize, toggleTextSize } = useTextSize(); // Get textSize and toggleTextSize from context

    // Function to fetch data from the backend API
    const fetchData = async (startDate, endDate) => {
        // Placeholder for backend API request
        try {
            // Simulate response data
            const mockIngredientNames = ["Ingredient A", "Ingredient B", "Ingredient C"];
            const mockTotalAmountChangedList = [100, 200, 150];

            // Set state with mock data
            setIngredientNames(mockIngredientNames);
            setTotalAmountChangedList(mockTotalAmountChangedList);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Fetch data when component mounts or when startDate or endDate changes
    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate]);

    return (
        <div className={`prod-usage ${textSize === 'large' ? 'large-text' : ''}`}>
            {/* Button to toggle text size */}
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h1>Produce Usage (negative)</h1>
            <div className="chart">
                {/* Draw bars based on fetched data */}
                {ingredientNames.map((ingredientName, index) => (
                    <div key={index} className="bar-container">
                        {/* Example bar with hard-coded height */}
                        <div
                            className="bar"
                            style={{ height: `${totalAmountChangedList[index]}px` }}
                        />
                        {/* Display ingredient name */}
                        <span className="label">{ingredientName}</span>
                    </div>
                ))}
            </div>
            {/* Button to navigate to Trends component */}
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default ProdUsage;
