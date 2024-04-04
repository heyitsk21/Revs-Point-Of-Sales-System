import React, { useEffect, useState } from 'react';
import './ExcessReport.css';
import { useTextSize } from './components/TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests

const ExcessReport = ({ onPageChange }) => {
    const [startDate, setStartDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [speakEnabled, setSpeakEnabled] = useState(false); // State to track whether speak feature is enabled
    const { textSize, toggleTextSize } = useTextSize();

    const fetchData = async () => {
        try {
            const response = await axios.post('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/reports/generateexcessreport', {
                startdate: startDate
            });
            const formattedData = response.data.map(item => ({ itemname: item.itemname, menuid: item.menuid }));
            setReportData(formattedData);
        } catch (error) {
            console.error('Error fetching excess report data:', error);
        }
    };

    const handleGenerateExcessReport = () => {
        if (isValidDate(startDate)) {
            fetchData();
        } else {
            alert('Please enter a valid start date (YYYY-MM-DD).');
        }
    };

    const isValidDate = (date) => {
        return date.match(/\d{4}-\d{2}-\d{2}/);
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
        <div className={`excess-report ${textSize === 'large' ? 'large-text' : ''}`} onMouseOver={handleMouseOver}>
            <div className="toggle-button-container">
                <button className={`speak-button ${speakEnabled ? 'speak-on' : 'speak-off'}`} onClick={toggleSpeak}>{speakEnabled ? 'Speak On' : 'Speak Off'}</button>
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <button onClick={() => onPageChange('trends')} onMouseOver={handleMouseOver}>Go to Trends</button>
            <h2 onMouseOver={handleMouseOver}>Excess Report</h2>
            <div className="date-fields">
                <label onMouseOver={handleMouseOver}>Start Date:</label>
                <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                    onMouseOver={handleMouseOver}
                />
            </div>
            <div className="report-table">
                <div className="report-row header">
                    <div className="report-cell">Ingredient ID</div>
                    <div className="report-cell">Ingredient Name</div>
                </div>
                {reportData.map((item, index) => (
                    <div key={index} className="report-row">
                        <div className="report-cell" onMouseOver={handleMouseOver}>{item.menuid}</div>
                        <div className="report-cell" onMouseOver={handleMouseOver}>{item.itemname}</div>
                    </div>
                ))}
            </div>
            <button onClick={handleGenerateExcessReport} onMouseOver={handleMouseOver}>Generate Excess Report</button>
        </div>
    );
};

export default ExcessReport;
