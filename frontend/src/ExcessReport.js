import React, { useEffect, useState } from 'react';
import './ExcessReport.css';
import { useTextSize } from './TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests

const ExcessReport = ({ onPageChange }) => {
    const [startDate, setStartDate] = useState('');
    const [reportData, setReportData] = useState([]);
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

    return (
        <div className={`excess-report ${textSize === 'large' ? 'large-text' : ''}`}>
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Excess Report</h2>
            <div className="date-fields">
                <label>Start Date:</label>
                <input
                    type="text"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    placeholder="YYYY-MM-DD"
                />
            </div>
            <div className="report-table">
                <div className="report-row header">
                    <div className="report-cell">Ingredient ID</div>
                    <div className="report-cell">Ingredient Name</div>
                </div>
                {reportData.map((item, index) => (
                    <div key={index} className="report-row">
                        <div className="report-cell">{item.menuid}</div>
                        <div className="report-cell">{item.itemname}</div>
                    </div>
                ))}
            </div>
            <button onClick={handleGenerateExcessReport}>Generate Excess Report</button>
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default ExcessReport;
