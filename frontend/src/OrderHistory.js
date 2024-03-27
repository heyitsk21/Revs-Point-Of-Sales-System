import React, { useState, useEffect } from 'react';
import './OrderHistory.css'; // Import CSS file for styling
import { useTextSize } from './TextSizeContext'; // Import the useTextSize hook

const OrderHistory = ({ onPageChange }) => {
    // Example order data
    const exampleOrders = [
        { id: 1, customerName: 'John Doe', taxPrice: 2.5, basePrice: 20.0, totalPrice: 22.5, dateTime: '2024-03-25 15:30:00', employeeID: 101 },
        { id: 2, customerName: 'Jane Smith', taxPrice: 1.75, basePrice: 15.0, totalPrice: 16.75, dateTime: '2024-03-26 12:45:00', employeeID: 102 }
    ];

    // State variables for UI components
    const [orders, setOrders] = useState(exampleOrders); // State to store order items
    const [selectedOrder, setSelectedOrder] = useState(null); // State to store the selected order
    const { textSize, toggleTextSize } = useTextSize(); // Get textSize and toggleTextSize from context

    // Function to handle row selection in the order list
    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    // Function to render order items in the list
    const renderOrderItems = () => {
        return orders.map(order => (
            <div key={order.id} className={`order-item ${selectedOrder && selectedOrder.id === order.id ? 'selected' : ''}`} onClick={() => handleOrderClick(order)}>
                <span>ID: {order.id}</span>
                <span>Customer: {order.customerName}</span>
                <span>Price: ${order.totalPrice.toFixed(2)}</span>
                <span>Date/Time: {order.dateTime}</span>
            </div>
        ));
    };

    // Function to format the date/time string
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    return (
        <div className={`order-history ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="toggle-button-container">
                {/* Button to toggle text size */}
                <button className="toggle-button" onClick={toggleTextSize}>Toggle Text Size</button>
            </div>
            <div className="order-list">
                <h2>Order History</h2>
                {renderOrderItems()}
            </div>
            <div className="order-details">
                <h2>{selectedOrder ? `Order Details: ${selectedOrder.id}` : 'Select an Order to View Details'}</h2>
                {selectedOrder && (
                    <div className="selected-order">
                        <span>ID: {selectedOrder.id}</span>
                        <span>Customer: {selectedOrder.customerName}</span>
                        <span>Base Price: ${selectedOrder.basePrice.toFixed(2)}</span>
                        <span>Tax Price: ${selectedOrder.taxPrice.toFixed(2)}</span>
                        <span>Total Price: ${selectedOrder.totalPrice.toFixed(2)}</span>
                        <span>Date/Time: {formatDate(selectedOrder.dateTime)}</span>
                        <span>Employee ID: {selectedOrder.employeeID}</span>
                    </div>
                )}
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

export default OrderHistory;
