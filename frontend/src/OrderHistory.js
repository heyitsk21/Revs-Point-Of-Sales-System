import React, { useState, useEffect } from 'react';
import './OrderHistory.css'; 
import { useTextSize } from './TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests

const OrderHistory = ({ onPageChange }) => {
    const [orders, setOrders] = useState([]); // Initialize state for orders
    const [selectedOrder, setSelectedOrder] = useState(null); 
    const { textSize, toggleTextSize } = useTextSize(); 

    // Function to fetch order history from the backend API
    const fetchOrderHistory = async () => {
        try {
            const response = await axios.get('https://project-3-full-stack-agile-web-team-21-1.onrender.com/api/manager/orderhistory');
            setOrders(response.data); // Update orders state with response data
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    // Call fetchOrderHistory function when component mounts
    useEffect(() => {
        fetchOrderHistory();
    }, []);

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    const renderOrderItems = () => {
        return orders.map(order => (
            <div key={order.orderid} className={`order-item ${selectedOrder && selectedOrder.orderid === order.orderid ? 'selected' : ''}`} onClick={() => handleOrderClick(order)}>
                <div>ID: {order.orderid}</div>
                <div>Customer: {order.customername}</div>
                <div>Price: ${parseFloat(order.baseprice) + parseFloat(order.taxprice)}</div>
                <div>Date/Time: {order.orderdatetime}</div>
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
                <h2>{selectedOrder ? `Order Details: ${selectedOrder.orderid}` : 'Select an Order to View Details'}</h2>
                {selectedOrder && (
                    <div className="selected-order">
                        <div>ID: {selectedOrder.orderid}</div>
                        <div>Customer: {selectedOrder.customername}</div>
                        <div>Base Price: ${parseFloat(selectedOrder.baseprice)}</div>
                        <div>Tax Price: ${parseFloat(selectedOrder.taxprice)}</div>
                        <div>Total Price: ${(parseFloat(selectedOrder.baseprice) + parseFloat(selectedOrder.taxprice))}</div>
                        <div>Date/Time: {formatDate(selectedOrder.orderdatetime)}</div>
                        <div>Employee ID: {selectedOrder.employeeid}</div>
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
