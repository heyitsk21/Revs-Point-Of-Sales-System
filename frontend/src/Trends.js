import React, { useState, useEffect } from 'react';
import './Trends.css';
import { useTextSize } from './TextSizeContext';

const Trends = ({ onPageChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { textSize, toggleTextSize } = useTextSize();

    const isValidDate = (date) => {
        return date.match(/\d{4}-\d{2}-\d{2}/);
    };

    useEffect(() => {
        if (!window.google || !window.google.translate || !window.google.translate.TranslateElement) {
            const script = document.createElement('script');
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);

            window.googleTranslateElementInit = () => {
                new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');
            };
        }
    }, []);

    const handleGenerateProdUsage = () => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            onPageChange('prodUsage');
        } else {
            alert('Please enter valid dates (YYYY-MM-DD).');
        }
    };

    const handleGenerateSalesReport = () => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            onPageChange('salesReport');
        } else {
            alert('Please enter valid dates (YYYY-MM-DD).');
        }
    };

    const handleGenerateExcessReport = () => {
        if (isValidDate(startDate)) {
            onPageChange('excessReport');
        } else {
            alert('Please enter a valid start date (YYYY-MM-DD).');
        }
    };

    const handleGenerateRestockReport = () => {
        onPageChange('restockReport');
    };

    const handleGenerateOrderTrendReport = () => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            onPageChange('orderTrend');
        } else {
            alert('Please enter valid dates (YYYY-MM-DD).');
        }
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className={`trends ${textSize === 'large' ? 'large-text' : ''}`}>
            <div id="google_translate_element"></div>
            <button onClick={() => speakText("... Trends... Start Date... End Date... Generate Prodoct Usage... Generate Sales Report... Generate Excess Report... Generate Restock Report... Generate Order Trend Report... Trends... Inventory... Menu Items... Order History... ")}>Speak</button>
            <button onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Trends</h2>
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
            <div className="trend-buttons">
                <button onClick={handleGenerateProdUsage}>Generate Product Usage</button>
                <button onClick={handleGenerateSalesReport}>Generate Sales Report</button>
                <button onClick={handleGenerateExcessReport}>Generate Excess Report</button>
                <button onClick={handleGenerateRestockReport}>Generate Restock Report</button>
                <button onClick={handleGenerateOrderTrendReport}>Generate Order Trend Report</button>
            </div>
            <div className="bottom-nav">
                <button onClick={() => onPageChange('trends')}>Trends</button>
                <button onClick={() => onPageChange('inventory')}>Inventory</button>
                <button onClick={() => onPageChange('menuItems')}>Menu Items</button>
                <button onClick={() => onPageChange('orderHistory')}>Order History</button>
            </div>
        </div>
    );
};

export default Trends;
