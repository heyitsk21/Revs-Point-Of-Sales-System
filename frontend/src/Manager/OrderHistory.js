/**
 * React component for managing orderhistory.
 * @returns {JSX.Element} OrderHistory component
 */

import React, { useState, useEffect, useRef } from 'react';
import './OrderHistory.css';
import './../Common.css';
import { useTextSize } from '../components/TextSizeContext';
import axios from 'axios';
import ManagerTopBar from '../components/ManagerTopBar';
import RevThankYou from '../components/RevThankYou';
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";

/**
 * React component for managing order history.
 * @returns {JSX.Element} OrderHistory component
 */
const OrderHistory = () => {
    /**
     * State variable for orders data.
     * @type {[Object[], function]} Array containing orders data and a function to update it
     */
    const [orders, setOrders] = useState([]);
    
    /**
     * State variable for the selected order.
     * @type {[Object, function]} Object representing the selected order and a function to update it
     */
    const [selectedOrder, setSelectedOrder] = useState(null);
    
    /**
     * State variable to control displaying the RevThankYou component.
     * @type {[boolean, function]} Boolean indicating whether to show the RevThankYou component and a function to update it
     */
    const [showRevThankYou, setShowRevThankYou] = useState(false);
    
    /**
     * State variable for HighContrast mode.
     * @type {[boolean, function]} Boolean indicating whether HighContrast mode is enabled and a function to update it
     */
    const [highContrast, setHighContrast] = useState(false);
    
    /**
     * Reference to the search input element.
     * @type {React.RefObject<HTMLInputElement>} Reference to the search input element
     */
    const searchInputRef = useRef(null);
    
    /**
     * State variable for orders date.
     * @type {[string, function]} String representing the date of orders and a function to update it
     */
    const [ordersDate, setOrdersDate] = useState('');
    
    /**
     * Fetches order history from the backend.
     */
    const fetchOrderHistory = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/orderhistory');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching order history:', error);
        }
    };

    useEffect(() => {
        fetchOrderHistory();
    }, []);

    useEffect(() => {
        const fetchFilteredOrders = async () => {
            try {
                const response = await axios.get(`https://team21revsbackend.onrender.com/api/manager/orderhistory?date=${ordersDate}`);
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching filtered orders:', error);
            }
        };
        fetchFilteredOrders();
        console.log("Orders would be grabbed here");
    }, [ordersDate]);

    /**
     * Handles the click event on an order.
     * @param {Object} order - The order object that was clicked
     */
    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    /**
     * Renders the order items.
     * @returns {JSX.Element[]} Array of JSX Elements representing order items
     */
    const renderOrderItems = () => {
        return orders.map(order => (
            <div key={order.orderid} className={`order-item ${selectedOrder && selectedOrder.orderid === order.orderid ? 'selected' : ''}`} onClick={() => handleOrderClick(order)}>
                <div>ID: {order.orderid}</div>
                <div>Customer: {order.customername}</div>
                <div>Price: ${(parseFloat(order.baseprice) + parseFloat(order.taxprice)).toFixed(2)}</div>
                <div>Date/Time: {order.orderdatetime}</div>
            </div>
        ));
    };

    /**
     * Formats the date and time.
     * @param {string} dateTime - The date and time string to format
     * @returns {string} Formatted date and time string
     */
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    /**
     * Handles the search action.
     */
    const handleSearch = () => {
        const searchText = searchInputRef.current.value;
        window.find(searchText);
    };

    /**
     * Handles the action to show RevThankYou component.
     */
    const handleShowRevThankYou = () => {
        setShowRevThankYou(true);
    };

    /**
     * Toggles the high contrast mode.
     */
    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
    };

    return (
        <div className={`order-manager ${textSize === 'large' ? 'large-text' : ''} ${highContrast ? 'high-contrast' : ''}`}>
            <ManagerTopBar toggleHighContrast={toggleHighContrast} />
            <div className='manager-order-history'>
                <div className="order-details">
                    <button onClick={handleShowRevThankYou}>SUBMIT ORDER</button>
                    <h2>{selectedOrder ? `Order Details: ${selectedOrder.orderid}` : 'Select an Order to View Details'}</h2>
                    {selectedOrder && (
                        <div className="selected-order">
                            <div>ID: {selectedOrder.orderid}</div>
                            <div>Customer: {selectedOrder.customername}</div>
                            <div>Base Price: ${parseFloat(selectedOrder.baseprice).toFixed(2)}</div>
                            <div>Tax Price: ${parseFloat(selectedOrder.taxprice).toFixed(2)}</div>
                            <div>Total Price: ${(parseFloat(selectedOrder.baseprice) + parseFloat(selectedOrder.taxprice)).toFixed(2)}</div>
                            <div>Date/Time: {formatDate(selectedOrder.orderdatetime)}</div>
                            <div>Employee ID: {selectedOrder.employeeid}</div>
                        </div>
                    )}
                </div>
                <div className='order-history'>
                    <div className="search-bar">
                        <input className='order-history-input' type="text" placeholder="Search..." ref={searchInputRef} />
                        <button className='order-history-button' onClick={handleSearch}>Search</button>
                    </div>
                    <div className="order-list">
                        <h2>Order History</h2>
                        <label>Find Orders for:</label>
                        <DatePicker selected={ordersDate} onChange={(date) => setOrdersDate(date)} />
                        {renderOrderItems()}
                    </div>
                </div>
            </div>
            {showRevThankYou && <RevThankYou onAnimationEnd={() => setShowRevThankYou(false)} />} {/* Pass onAnimationEnd event to handle reset */}
        </div>
    );
};

export default OrderHistory;
