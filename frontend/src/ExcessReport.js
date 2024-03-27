import React, { useEffect, useState } from 'react';
import './ExcessReport.css'; // Import CSS file for styling
import { useTextSize } from './TextSizeContext'; // Import the useTextSize hook

const ExcessReport = ({ startDate, onPageChange }) => {
    const [reportData, setReportData] = useState([]);
    const { textSize, toggleTextSize } = useTextSize(); // Get textSize and toggleTextSize from context

    useEffect(() => {
        fetchData(startDate);
    }, [startDate]);

    const fetchData = async (startDate) => {
        try {
            // Simulated data for testing
            const data = [
                { menuID: 1, itemName: 'Ingredient 1' },
                { menuID: 2, itemName: 'Ingredient 2' },
                { menuID: 3, itemName: 'Ingredient 3' }
            ];
            setReportData(data);
        } catch (error) {
            console.error('Error fetching excess report data:', error);
            // Handle error (e.g., show error message)
        }
    };

    return (
        <div className={`excess-report ${textSize === 'large' ? 'large-text' : ''}`}>
            {/* Button to toggle text size */}
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Excess Report</h2>
            <div className="report-table">
                <div className="report-row header">
                    <div className="report-cell">Ingredient ID</div>
                    <div className="report-cell">Ingredient Name</div>
                </div>
                {reportData.map((item, index) => (
                    <div key={index} className="report-row">
                        <div className="report-cell">{item.menuID}</div>
                        <div className="report-cell">{item.itemName}</div>
                    </div>
                ))}
            </div>
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default ExcessReport;
