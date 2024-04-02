import React, { useState, useEffect } from 'react';
import './ProdUsage.css';
import { useTextSize } from './TextSizeContext';
import axios from 'axios';

const ProdUsage = ({ onPageChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ingredientData, setIngredientData] = useState([]);
    const { textSize, toggleTextSize } = useTextSize();

    useEffect(() => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            fetchData(startDate, endDate);
        }
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        try {
            const response = await axios.post('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/reports/generateproductusage', {
                startdate: startDate,
                enddate: endDate
            });
            console.log('Response from API:', response.data);

            setIngredientData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const isValidDate = (date) => {
        return date.match(/\d{4}-\d{2}-\d{2}/);
    };

    const calculateTotal = () => {
        return ingredientData.reduce((acc, ingredient) => acc + Math.abs(parseFloat(ingredient.totalamountchanged)), 0);
    };

    return (
        <div className={`prod-usage ${textSize === 'large' ? 'large-text' : ''}`}>
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h1>Produce Usage (negative)</h1>
            <div className="date-fields">
                <label>Start Date:</label>
                <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
                <label>End Date:</label>
                <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
            </div>
            <button onClick={() => fetchData(startDate, endDate)}>Generate Product Usage</button>
            <div className="chart">
                {ingredientData.length > 0 ? (
                    ingredientData.map((ingredient, index) => (
                        <div key={index} className="line-container">
                            <div
                                className="line"
                                style={{ width: (Math.abs(parseFloat(ingredient.totalamountchanged)) / calculateTotal() * 100) * 100 + '%' }}
                            >
                                <span className="line-label">{Math.abs(parseFloat(ingredient.totalamountchanged)).toFixed(2)}</span>
                            </div>
                            <span className="label">{ingredient.ingredientname}</span>
                        </div>
                    ))
                ) : (
                    <p>No data to display</p>
                )}
            </div>
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default ProdUsage;
