import React, { useEffect, useState } from 'react';
import './Report.css';
import { useTextSize } from '../../components/TextSizeContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestockReport () {
    const navigate = useNavigate();
    const [reportData, setReportData] = useState([]);
    const [speakEnabled, setSpeakEnabled] = useState(false);
    const { textSize, toggleTextSize } = useTextSize();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/reports/generaterestockreport');
            console.log('Response from API:', response.data);
            setReportData(response.data);
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
        <div className={`restock-report ${textSize === 'large' ? 'large-text' : ''}`} onMouseOver={handleMouseOver}>
            <div className="toggle-button-container">
                <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <button className="trends-button" onClick={() => navigate('/manager/trends')}>Return</button>
            <h2 onMouseOver={handleMouseOver}>Restock Report</h2>
            <div className="report-list">
                <div className="report-header">
                    <span className="header-item">Ingredient</span>
                    <span className="header-item">Current Amount</span>
                    <span className="header-item">Minimum Amount</span>
                </div>
                {reportData.map((item, index) => (
                    <div key={index} className="report-item">
                        <span className="report-item" onMouseOver={handleMouseOver}>{item.ingredientname}</span>
                        <span className="report-item" onMouseOver={handleMouseOver}>{item.count}</span>
                        <span className="report-item" onMouseOver={handleMouseOver}>{item.minamount}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RestockReport;