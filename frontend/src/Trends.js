import React, { useState, useEffect } from 'react';
import './Trends.css';
import { useTextSize } from './TextSizeContext';

const Trends = ({ onPageChange }) => {
    const { textSize, toggleTextSize } = useTextSize();

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
        onPageChange('prodUsage');
    };

    const handleGenerateSalesReport = () => {
        onPageChange('salesReport');
    };

    const handleGenerateExcessReport = () => {
        onPageChange('excessReport');
    };

    const handleGenerateRestockReport = () => {
        onPageChange('restockReport');
    };

    const handleGenerateOrderTrendReport = () => {
        onPageChange('orderTrend');
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className={`trends ${textSize === 'large' ? 'large-text' : ''}`}>
            <div id="google_translate_element"></div>
            <button onClick={() => speakText("... Trends... Generate Prodoct Usage... Generate Sales Report... Generate Excess Report... Generate Restock Report... Generate Order Trend Report... Trends... Inventory... Menu Items... Order History... ")}>Speak</button>
            <button onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Trends</h2>
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
