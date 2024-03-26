import React, { useState } from 'react';
import './Trends.css'; // Import CSS file for styling

const Trends = ({ onPageChange }) => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleGenerateProdUsage = () => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            // Implement logic to generate ProdUsage
            console.log('Generating ProdUsage report...');
        } else {
            alert('Please enter valid dates (YYYY-MM-DD).');
        }
    };

    const handleGenerateSalesReport = () => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            // Implement logic to generate Sales Report
            console.log('Generating Sales Report...');
        } else {
            alert('Please enter valid dates (YYYY-MM-DD).');
        }
    };

    const handleGenerateExcessReport = () => {
        if (isValidDate(startDate)) {
            // Implement logic to generate Excess Report
            console.log('Generating Excess Report...');
        } else {
            alert('Please enter a valid start date (YYYY-MM-DD).');
        }
    };

    const handleGenerateRestockReport = () => {
        // Implement logic to generate Restock Report
        console.log('Generating Restock Report...');
    };

    const handleGenerateOrderTrendReport = () => {
        if (isValidDate(startDate) && isValidDate(endDate)) {
            // Implement logic to generate Order Trend Report
            console.log('Generating Order Trend Report...');
        } else {
            alert('Please enter valid dates (YYYY-MM-DD).');
        }
    };

    const isValidDate = (date) => {
        return date.match(/\d{4}-\d{2}-\d{2}/);
    };

    return (
        <div className="trends">
            <h2>Trends</h2>
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
            <div className="trend-buttons">
                <button onClick={handleGenerateProdUsage}>Generate ProdUsage</button>
                <button onClick={handleGenerateSalesReport}>Generate Sales Report</button>
                <button onClick={handleGenerateExcessReport}>Generate Excess Report</button>
                <button onClick={handleGenerateRestockReport}>Generate Restock Report</button>
                <button onClick={handleGenerateOrderTrendReport}>Generate Order Trend Report</button>
            </div>
            {/* Bottom navigation */}
            <div className="bottom-nav">
                <button onClick={() => onPageChange('trends')}>Trends</button>
                <button onClick={() => onPageChange('inventory')}>Inventory</button>
                <button onClick={() => onPageChange('menuItems')}>Menu Items</button>
                <button onClick={() => onPageChange('orderHistory')}>Order History</button>
            </div>
        </div>
    );
};

export default Trends;
