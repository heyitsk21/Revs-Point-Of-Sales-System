import React, { useState, useEffect } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProdUsage () {
    const navigate = useNavigate();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [ingredientData, setIngredientData] = useState([]);
    const [speakEnabled, setSpeakEnabled] = useState(false);
    const { textSize, toggleTextSize } = useTextSize();

    useEffect(() => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            fetchData(startDate, endDate);
        }
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        try {
            const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/reports/generateproductusage', {
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

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleMouseOver = debounce((event) => {
        let hoveredElementText = '';
        if (speakEnabled) {
            if (event.target.innerText) {
                hoveredElementText = event.target.innerText;
            } else if (event.target.value) {
                hoveredElementText = event.target.value;
            } else if (event.target.getAttribute('aria-label')) {
                hoveredElementText = event.target.getAttribute('aria-label');
            } else if (event.target.getAttribute('aria-labelledby')) {
                const id = event.target.getAttribute('aria-labelledby');
                const labelElement = document.getElementById(id);
                if (labelElement) {
                    hoveredElementText = labelElement.innerText;
                }
            }
            speakText(hoveredElementText);
        }
    }, 1000);

    const toggleSpeak = () => {
        if (speakEnabled) {
            window.speechSynthesis.cancel();
        }
        setSpeakEnabled(!speakEnabled);
    };

    return (
        <div className={`prod-usage ${textSize === 'large' ? 'large-text' : ''}`} onMouseOver={handleMouseOver}>
            <div className="toggle-button-container">
                <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
            <h1 onMouseOver={handleMouseOver}>Produce Usage (negative)</h1>
            <div className="date-fields">
                <label onMouseOver={handleMouseOver}>Start Date:</label>
                <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
                <label onMouseOver={handleMouseOver}>End Date:</label>
                <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
            </div>
            <button onClick={() => fetchData(startDate, endDate)} onMouseOver={handleMouseOver}>Generate Product Usage</button>
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
                            <span className="label" onMouseOver={handleMouseOver}>{ingredient.ingredientname}</span>
                        </div>
                    ))
                ) : (
                    <p>No data to display</p>
                )}
            </div>
        </div>
    );
};

export default ProdUsage;
