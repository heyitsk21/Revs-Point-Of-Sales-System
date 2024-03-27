import React, { useEffect, useState } from 'react';
import './OrderTrend.css'; // Import CSS file for styling

const OrderTrend = ({ startDate, endDate, onPageChange }) => {
    const [menuID1, setMenuID1] = useState([]);
    const [menuID2, setMenuID2] = useState([]);
    const [count, setCount] = useState([]);

    useEffect(() => {
        fetchData(startDate, endDate);
    }, [startDate, endDate]);

    const fetchData = async (startDate, endDate) => {
        // Placeholder for backend API request
        try {
            // Simulated data
            const mockMenuID1 = ["MenuID1_A", "MenuID1_B", "MenuID1_C"];
            const mockMenuID2 = ["MenuID2_A", "MenuID2_B", "MenuID2_C"];
            const mockCount = [10, 20, 15];

            // Set state with mock data
            setMenuID1(mockMenuID1);
            setMenuID2(mockMenuID2);
            setCount(mockCount);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    return (
        <div className="order-trend">
            <h2>Order Trend Report</h2>
            <div className="report-list">
                <div className="report-header">
                    <span className="header-item">Menu Item 1</span>
                    <span className="header-item">Menu Item 2</span>
                    <span className="header-item">Pair Count</span>
                </div>
                {menuID1.map((menuItem1, index) => (
                    <div key={index} className="report-item">
                        <span className="report-item">{menuItem1}</span>
                        <span className="report-item">{menuID2[index]}</span>
                        <span className="report-item">{count[index]}</span>
                    </div>
                ))}
            </div>
            {/* Button to navigate back to Trends */}
            <button onClick={() => onPageChange('trends')}>Back to Trends</button>
        </div>
    );
};

export default OrderTrend;
