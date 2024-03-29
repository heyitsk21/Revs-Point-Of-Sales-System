import React, { useEffect, useState } from 'react';
import './ExcessReport.css';
import { useTextSize } from '../TextSizeContext';

const ExcessReport = ({ startDate, onPageChange }) => {
    const [reportData, setReportData] = useState([]);
    const { textSize, toggleTextSize } = useTextSize();

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
            // Handle error 
        }
    };

    return (
        <div className={`excess-report ${textSize === 'large' ? 'large-text' : ''}`}>
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
