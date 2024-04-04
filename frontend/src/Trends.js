import React, { useState } from 'react';
import './Trends.css';
import { useTextSize } from './components/TextSizeContext';
import ManagerTopBar from './components/ManagerTopBar';
import ManagerBottomBar from './components/ManagerBottomBar';

const Trends = ({ onPageChange }) => {
    const { textSize} = useTextSize();
    const [speakEnabled] = useState(false);


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

    return (
        <div className={`trends ${textSize === 'large' ? 'large-text' : ''}`}>


            <ManagerTopBar/>
            <h2 onMouseOver={() => handleMouseOver("Trends")}>Trends</h2>
            <div className="trend-buttons">
                <button onMouseOver={() => handleMouseOver("Generate Product Usage")} onClick={handleGenerateProdUsage}>Generate Product Usage</button>
                <button onMouseOver={() => handleMouseOver("Generate Sales Report")} onClick={handleGenerateSalesReport}>Generate Sales Report</button>
                <button onMouseOver={() => handleMouseOver("Generate Excess Report")} onClick={handleGenerateExcessReport}>Generate Excess Report</button>
                <button onMouseOver={() => handleMouseOver("Generate Restock Report")} onClick={handleGenerateRestockReport}>Generate Restock Report</button>
                <button onMouseOver={() => handleMouseOver("Generate Order Trend Report")} onClick={handleGenerateOrderTrendReport}>Generate Order Trend Report</button>
            </div>
            <ManagerBottomBar onPageChange={onPageChange} />
        </div>
    );
};

export default Trends;
