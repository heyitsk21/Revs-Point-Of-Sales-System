import React, { useEffect, useState } from 'react';
import './RestockReport.css'; // Import CSS file for styling
import { useTextSize } from './TextSizeContext'; // Import the useTextSize hook

const RestockReport = ({ database, onPageChange }) => {
    const [reportData, setReportData] = useState([]);
    const { textSize, toggleTextSize } = useTextSize(); // Get textSize and toggleTextSize from context

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        // Simulating fetching data from the backend
        const query = "SELECT * FROM ingredients WHERE count < minamount";
        try {
            // Simulated data
            const simulatedData = [
                { ingredientName: "Ingredient 1", count: 5, minAmount: 10 },
                { ingredientName: "Ingredient 2", count: 7, minAmount: 15 },
                { ingredientName: "Ingredient 3", count: 3, minAmount: 8 }
            ];
            setReportData(simulatedData);
        } catch (error) {
            console.error('Error fetching data:', error);
            // To handle errors
        }
    };

    return (
        <div className={`restock-report ${textSize === 'large' ? 'large-text' : ''}`}>
            {/* Button to toggle text size */}
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
                        <span className="report-item">{item.ingredientName}</span>
                        <span className="report-item">{item.count}</span>
                        <span className="report-item">{item.minAmount}</span>
                    </div>
                ))}
            </div>
            {/* Button to navigate to Trends component */}
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default RestockReport;
