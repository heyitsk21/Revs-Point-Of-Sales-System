import React, { useEffect, useState } from 'react';
import './OrderTrend.css';
import { useTextSize } from './TextSizeContext';
import axios from 'axios';

const OrderTrend = ({ onPageChange }) => {
    const [menuData, setMenuData] = useState([]);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const { textSize, toggleTextSize } = useTextSize();

    useEffect(() => {
        fetchData(startDate, endDate);
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

    return (
        <div className={`order-trend ${textSize === 'large' ? 'large-text' : ''}`}>
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Order Trend Report</h2>
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
            <button onClick={() => fetchData(startDate, endDate)}>Generate Trend Report</button>
            <div className="report-list">
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
            <button onClick={() => onPageChange('trends')}>Back to Trends</button>
        </div>
    );
};

export default OrderTrend;
