import React, { useState, useEffect } from 'react';
import './SalesReport.css'; // Import CSS file for styling

const SalesReport = ({ startDate, endDate, onPageChange }) => {
    const [reportData, setReportData] = useState([
        { menuID: 1, itemName: 'Cheeseburger', totalSales: 8.99, count: 5 } // Example Cheeseburger sale
    ]); // State to store sales report data

    // Function to fetch data from the database for the sales report
    const fetchData = async () => {
        try {
            // Make a request to the backend API to fetch sales report data
            const response = await fetch(`/api/salesReport?startDate=${startDate}&endDate=${endDate}`);
            const data = await response.json();
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
        <div className="sales-report">
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
