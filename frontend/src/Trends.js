import React, { useState, useEffect } from 'react';
import './Trends.css';
import { useTextSize } from './TextSizeContext';

const Trends = ({ onPageChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    const [speakEnabled, setSpeakEnabled] = useState(false);

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

    const handleMouseOver = (text) => {
        if (speakEnabled) {
            setTimeout(() => {
                speakText(text);
            }, 1000); // 1-second delay
        }
    };

    const toggleSpeak = () => {
        if (speakEnabled) {
            window.speechSynthesis.cancel();
        }
        setSpeakEnabled(!speakEnabled);
    };

    return (
        <div className={`trends ${textSize === 'large' ? 'large-text' : ''}`}>
            <div id="google_translate_element"></div>
            <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak} onMouseOver={handleMouseOver}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
            <button onMouseOver={() => handleMouseOver("Toggle Text Size")} onClick={toggleTextSize}>Toggle Text Size</button>
            <h2 onMouseOver={() => handleMouseOver("Trends")}>Trends</h2>
            <div className="trend-buttons">
                <button onMouseOver={() => handleMouseOver("Generate Product Usage")} onClick={handleGenerateProdUsage}>Generate Product Usage</button>
                <button onMouseOver={() => handleMouseOver("Generate Sales Report")} onClick={handleGenerateSalesReport}>Generate Sales Report</button>
                <button onMouseOver={() => handleMouseOver("Generate Excess Report")} onClick={handleGenerateExcessReport}>Generate Excess Report</button>
                <button onMouseOver={() => handleMouseOver("Generate Restock Report")} onClick={handleGenerateRestockReport}>Generate Restock Report</button>
                <button onMouseOver={() => handleMouseOver("Generate Order Trend Report")} onClick={handleGenerateOrderTrendReport}>Generate Order Trend Report</button>
            </div>
            <div className="bottom-nav">
                <button onMouseOver={() => handleMouseOver("Trends")} onClick={() => onPageChange('trends')}>Trends</button>
                <button onMouseOver={() => handleMouseOver("Inventory")} onClick={() => onPageChange('inventory')}>Inventory</button>
                <button onMouseOver={() => handleMouseOver("Menu Items")} onClick={() => onPageChange('menuItems')}>Menu Items</button>
                <button onMouseOver={() => handleMouseOver("Order History")} onClick={() => onPageChange('orderHistory')}>Order History</button>
            </div>
        </div>
    );
};

export default Trends;
