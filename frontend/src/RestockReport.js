import React, { useEffect, useState } from 'react';
import './RestockReport.css';
import { useTextSize } from './TextSizeContext';
import axios from 'axios';

const RestockReport = ({ onPageChange }) => {
    const [reportData, setReportData] = useState([]);
    const { textSize, toggleTextSize } = useTextSize();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/manager/reports/generaterestockreport');
            console.log('Response from API:', response.data);
            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className={`restock-report ${textSize === 'large' ? 'large-text' : ''}`}>
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Restock Report</h2>
            <div className="report-list">
                <div className="report-header">
                    <span className="header-item">Ingredient</span>
                    <span className="header-item">Current Amount</span>
                    <span className="header-item">Minimum Amount</span>
                </div>
                {reportData.map((item, index) => (
                    <div key={index} className="report-item">
                        <span className="report-item">{item.ingredientname}</span>
                        <span className="report-item">{item.count}</span>
                        <span className="report-item">{item.minamount}</span>
                    </div>
                ))}
            </div>
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default RestockReport;
