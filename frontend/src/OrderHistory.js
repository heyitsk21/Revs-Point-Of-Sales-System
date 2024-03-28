import React, { useState, useEffect } from 'react';
import './OrderHistory.css'; 
import { useTextSize } from './TextSizeContext';

const OrderHistory = ({ onPageChange }) => {
    const exampleOrders = [
        { id: 1, customerName: 'John Doe', taxPrice: 2.5, basePrice: 20.0, totalPrice: 22.5, dateTime: '2024-03-25 15:30:00', employeeID: 101 },
        { id: 2, customerName: 'Jane Smith', taxPrice: 1.75, basePrice: 15.0, totalPrice: 16.75, dateTime: '2024-03-26 12:45:00', employeeID: 102 }
    ];

    const [orders, setOrders] = useState(exampleOrders);
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const { textSize, toggleTextSize } = useTextSize(); 

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

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

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    return (
        <div className={`order-history ${textSize === 'large' ? 'large-text' : ''}`}>
            <div className="toggle-button-container">
                <button onClick={() => speakText("Order History... ID:... Customer:... Price:... Date/Time:... Select an Order to View Details... Trends... Inventory... Menu Items... Order History")}>Speak</button>
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
