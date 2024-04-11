import React, { useState } from 'react';
import './Trends.css';
import { useTextSize } from '../components/TextSizeContext';
import ManagerTopBar from '../components/ManagerTopBar';
import ManagerBottomBar from '../components/ManagerBottomBar';
import { useNavigate  } from 'react-router-dom';

function Trends () {
    const navigate = useNavigate();
    const { textSize} = useTextSize();
    const [speakEnabled] = useState(false);

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
                <button className="trends-button" onClick={() => navigate('/manager/trends/productusage')}>Generate Product Usage</button>
                <button className="trends-button" onClick={() => navigate('/manager/trends/sales')}>Generate Sales Report</button>
                <button className="trends-button" onClick={() => navigate('/manager/trends/excess')}>Generate Excess Report</button>
                <button className="trends-button" onClick={() => navigate('/manager/trends/restock')}>Generate Restock Report</button>
                <button className="trends-button" onClick={() => navigate('/manager/trends/ordertrend')}>Generate Order Trend Report</button>
            </div>
            <ManagerBottomBar />
        </div>
    );
};

export default Trends;
