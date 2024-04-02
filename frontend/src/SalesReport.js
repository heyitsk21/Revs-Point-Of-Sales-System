import React, { useState, useEffect } from 'react';
import './SalesReport.css';
import { useTextSize } from './TextSizeContext';
import axios from 'axios';

const SalesReport = ({ onPageChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const { textSize, toggleTextSize } = useTextSize();

    useEffect(() => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            fetchData(startDate, endDate);
        }
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        try {
            const response = await axios.post('http://127.0.0.1:5000/api/manager/reports/generatesalesreport', {
                startdate: startDate,
                enddate: endDate
            });
            console.log('Response from API:', response.data);

            setReportData(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const isValidDate = (date) => {
        return date.match(/\d{4}-\d{2}-\d{2}/);
    };

    return (
        <div className={`sales-report ${textSize === 'large' ? 'large-text' : ''}`}>
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Sales Report</h2>
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
            <button onClick={() => fetchData(startDate, endDate)}>Generate Sales Report</button>
            <div className="report-list">
                {reportData.length > 0 ? (
                    reportData.map((item, index) => (
                        <div key={index} className="report-item">
                            <span>Menu ID: {item.menuid}</span>
                            <span>Item Name: {item.itemname}</span>
                            <span>Sales: ${parseFloat(item.totalsales).toFixed(2)}</span>
                            <span>Amount Sold: {item.ordercount}</span>
                        </div>
                    ))
                ) : (
                    <p>No data to display</p>
                )}
            </div>
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default SalesReport;
