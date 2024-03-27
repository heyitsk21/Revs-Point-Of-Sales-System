import React, { useState, useEffect } from 'react';
import './SalesReport.css'; // Import CSS file for styling
import { useTextSize } from './TextSizeContext'; // Import the useTextSize hook

const SalesReport = ({ startDate, endDate, onPageChange }) => {
    const [reportData, setReportData] = useState([
        { menuID: 1, itemName: 'Cheeseburger', totalSales: 8.99, count: 5 } // Example Cheeseburger sale
    ]); // State to store sales report data
    const { textSize, toggleTextSize } = useTextSize(); // Get textSize and toggleTextSize from context

    // Function to fetch data from the database for the sales report
    const fetchData = async () => {
        try {
            // Simulate fetching data from the backend API
            // const response = await fetch(`/api/salesReport?startDate=${startDate}&endDate=${endDate}`);
            // const data = await response.json();
            // setReportData(data);

            // Simulated data for testing
            const data = [
                { menuID: 1, itemName: 'Cheeseburger', totalSales: 8.99, count: 5 }, // Example Cheeseburger sale
                { menuID: 2, itemName: 'Pizza', totalSales: 10.99, count: 3 }, // Example Pizza sale
                { menuID: 3, itemName: 'Salad', totalSales: 6.99, count: 7 } // Example Salad sale
            ];
            setReportData(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    // Function to format the sales report data for display
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
        // Call the fetchData function to fetch data from the database
        fetchData();
    }, [startDate, endDate]); // Fetch data whenever startDate or endDate changes

    return (
        <div className={`sales-report ${textSize === 'large' ? 'large-text' : ''}`}>
            {/* Button to toggle text size */}
            <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            <h2>Sales Report</h2>
            <div className="report-list">
                {formatReport()}
            </div>
            {/* Button to navigate to Trends component */}
            <button onClick={() => onPageChange('trends')}>Go to Trends</button>
        </div>
    );
};

export default SalesReport;
