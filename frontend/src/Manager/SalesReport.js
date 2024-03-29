import React, { useState, useEffect } from 'react';
import './SalesReport.css';
import { useTextSize } from '../TextSizeContext';

const SalesReport = ({ startDate, endDate, onPageChange }) => {
    const [reportData, setReportData] = useState([
        { menuID: 1, itemName: 'Cheeseburger', totalSales: 8.99, count: 5 }
    ]);
    const { textSize, toggleTextSize } = useTextSize();

    const fetchData = async () => {
        try {
            // Simulate fetching data from the backend API
            // const response = await fetch(`/api/salesReport?startDate=${startDate}&endDate=${endDate}`);
            // const data = await response.json();
            // setReportData(data);

            const data = [
                { menuID: 1, itemName: 'Cheeseburger', totalSales: 8.99, count: 5 },
                { menuID: 2, itemName: 'Pizza', totalSales: 10.99, count: 3 },
                { menuID: 3, itemName: 'Salad', totalSales: 6.99, count: 7 }
            ];
            setReportData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const formatReport = () => {
        return reportData.map((item, index) => (
            <div key={index} className="report-item">
                <span>Menu ID: {item.menuID}</span>
                <span>Item Name: {item.itemName}</span>
                <span>Sales: ${item.totalSales.toFixed(2)}</span>
                <span>Amount Sold: {item.count}</span>
            </div>
        ));
    };

    useEffect(() => {
        fetchData();
    }, [startDate, endDate]);

    return (
        <div className={`sales-report ${textSize === 'large' ? 'large-text' : ''}`}>
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Sales Report</h2>
            <div className="report-list">
                {formatReport()}
            </div>
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default SalesReport;
