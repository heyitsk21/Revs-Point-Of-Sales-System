import React, { useEffect, useState } from 'react';
import './OrderTrend.css';
import { useTextSize } from './TextSizeContext';
import axios from 'axios';

const OrderTrend = ({ onPageChange }) => {
    const [menuData, setMenuData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [speakEnabled, setSpeakEnabled] = useState(false); // State to track whether speak feature is enabled
    const { textSize, toggleTextSize } = useTextSize();

    useEffect(() => {
        if (startDate && endDate) {
            fetchData(startDate, endDate);
        }
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/manager/reports/generateordertrend', {
                startdate: startDate,
                enddate: endDate
            });
            console.log('Response from API:', response.data);
            setMenuData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
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
        <div className={`order-trend ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="toggle-button-container">
                <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <button onClick={() => onPageChange('trends')} onMouseOver={handleMouseOver}>Back to Trends</button>
            <h2 onMouseOver={handleMouseOver}>Order Trend Report</h2>
            <div className="date-fields">
                <label>Start Date:</label>
                <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    onMouseOver={handleMouseOver}
                />
                <label>End Date:</label>
                <input
                    type="text"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    onMouseOver={handleMouseOver}
                />
            </div>
            <button onClick={() => fetchData(startDate, endDate)} onMouseOver={handleMouseOver}>Generate Trend Report</button>
            <div className="report-list" onMouseOver={handleMouseOver}>
                <div className="report-header">
                    <span className="header-item">Menu Item 1</span>
                    <span className="header-item">Menu Item 2</span>
                    <span className="header-item">Pair Count</span>
                </div>
                {menuData.map((item, index) => (
                    <div key={index} className="report-item">
                        <span className="report-item">{item.menuid1}</span>
                        <span className="report-item">{item.menuid2}</span>
                        <span className="report-item">{item.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTrend;
