import React, { useState, useEffect } from 'react';
import './OrderHistory.css';
import { useTextSize } from '../components/TextSizeContext';
import axios from 'axios'; // Import Axios for making API requests
import ManagerTopBar from '../components/ManagerTopBar';
import ManagerBottomBar from '../components/ManagerBottomBar';

const OrderHistory = ({ onPageChange }) => {
    const [orders, setOrders] = useState([]); // Initialize state for orders
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [speakEnabled] = useState(false); // State to track whether speak feature is enabled
    const { textSize} = useTextSize(); // Access textSize state and toggleTextSize function

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
            <div key={order.orderid} className={`order-item ${selectedOrder && selectedOrder.orderid === order.orderid ? 'selected' : ''}`} onClick={() => handleOrderClick(order)} onMouseOver={handleMouseOver}>
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

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleMouseOver = debounce((event) => {
        let hoveredElementText = '';
        if (speakEnabled) {
            if (event.target.innerText) {
                hoveredElementText = event.target.innerText;
            } else if (event.target.value) {
                hoveredElementText = event.target.value;
            } else if (event.target.getAttribute('aria-label')) {
                hoveredElementText = event.target.getAttribute('aria-label');
            } else if (event.target.getAttribute('aria-labelledby')) {
                const id = event.target.getAttribute('aria-labelledby');
                const labelElement = document.getElementById(id);
                if (labelElement) {
                    hoveredElementText = labelElement.innerText;
                }
            }
            speakText(hoveredElementText);
        }
    }, 1000);

    return (
        <div className={`order-manager ${textSize === 'large' ? 'large-text' : ''}`} onMouseOver={handleMouseOver}>
            <ManagerTopBar/>
            <div className="order-details">
                <h2>{selectedOrder ? `Order Details: ${selectedOrder.orderid}` : 'Select an Order to View Details'}</h2>
                {selectedOrder && (
                    <div className="selected-order">
                        <div onMouseOver={handleMouseOver}>ID: {selectedOrder.orderid}</div>
                        <div onMouseOver={handleMouseOver}>Customer: {selectedOrder.customername}</div>
                        <div onMouseOver={handleMouseOver}>Base Price: ${parseFloat(selectedOrder.baseprice)}</div>
                        <div onMouseOver={handleMouseOver}>Tax Price: ${parseFloat(selectedOrder.taxprice)}</div>
                        <div onMouseOver={handleMouseOver}>Total Price: ${(parseFloat(selectedOrder.baseprice) + parseFloat(selectedOrder.taxprice))}</div>
                        <div onMouseOver={handleMouseOver}>Date/Time: {formatDate(selectedOrder.orderdatetime)}</div>
                        <div onMouseOver={handleMouseOver}>Employee ID: {selectedOrder.employeeid}</div>
                    </div>
                )}
            </div>
            <div className='order-history'>
            <div className="order-list">
                <h2 onMouseOver={handleMouseOver}>Order History</h2>
                {renderOrderItems()}
            </div>
            </div>
            <ManagerBottomBar onPageChange={onPageChange} />
        </div>
    );
};

export default OrderHistory;
