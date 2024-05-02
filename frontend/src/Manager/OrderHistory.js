/**
 * Represents the OrderHistory component that manages the display and interaction with historical orders.
 * This component integrates a date picker to filter orders, a search function, and visualization of selected order details.
 *
 * @component
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

const OrderHistory = () => {
    /**
     * Stores the list of orders.
     * @type {Array<Object>} // Specify the type of elements if known
     */
    const [orders, setOrders] = useState([]);

    /**
     * Stores the currently selected order for detail viewing.
     * @type {?Object} // Use ? to indicate that it can also be null
     */
    const [selectedOrder, setSelectedOrder] = useState(null);

    /**
     * Controls the visibility of the 'Thank You' review modal.
     * @type {boolean}
     */
    const [showRevThankYou, setShowRevThankYou] = useState(false);

    /**
     * Controls the application of a high contrast theme for accessibility.
     * @type {boolean}
     */
    const [highContrast, setHighContrast] = useState(false);

    /**
     * Retrieves text size settings from context.
     */
    const { textSize, updateTextSize } = useTextSize();

    /**
     * Reference to the search input field.
     * @type {React.RefObject<HTMLInputElement>}
     */
    const searchInputRef = useRef(null);

    /**
     * State for managing the date selection for order filtering.
     * @type {Date|string}
     */
    const [ordersDate, setOrdersDate] = useState('');

    /**
     * Fetches the order history from the backend API.
     * Asynchronously retrieves orders and updates the orders state.
     * @async
     */
    const fetchOrderHistory = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/manager/orderhistory');
            console.log(response.data);
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
                const response = await axios.post('https://team21revsbackend.onrender.com/api/manager/orderhistorybydate', {
                    startdate: ordersDate // Assuming your API expects the startdate field
                });
                console.log(response.data);
                setOrders(response.data);
                renderOrderItems();
            } catch (error) {
                console.error('Error fetching filtered orders:', error);
            }
        };
        if (ordersDate) {
            fetchFilteredOrders();
        }
        console.log("Orders would be grabbed here");
    }, [ordersDate]);

    /**
     * Handles click events on individual order items.
     * Updates the selectedOrder state with the clicked order's details.
     * @param {Object} order - The order data object.
     */
    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

    /**
     * Renders the list of order items.
     * Maps each order to an HTML element structure displaying the order details.
     * @returns {Array<JSX.Element>} The list of order elements.
     */
    const renderOrderItems = () => {
        return orders.map(order => (
            <div key={order.orderid} className={`order-item ${selectedOrder && selectedOrder.orderid === order.orderid ? 'selected' : ''}`} onClick={() => handleOrderClick(order)}>
                <div>ID: {order.orderid}</div>
                <div>Customer: {order.customername}</div>
                <div>Price: ${(parseFloat(order.baseprice) + parseFloat(order.taxprice)).toFixed(2)}</div>
                <div>Date/Time: {order.orderdatetime}</div>
                <div>Status: {order.status}</div>
            </div>
        ));
    };

    /**
     * Formats a date/time string into a more readable format.
     * @param {string} dateTime - The date/time string to format.
     * @returns {string} The formatted date/time string.
     */
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    /**
     * Triggers a browser-based text search within the component.
     * Uses the current value from the search input reference.
     */
    const handleSearch = () => {
        const searchText = searchInputRef.current.value;
        window.find(searchText);
    };

    /**
     * Toggles the visibility of the 'Thank You' modal.
     */
    const handleShowRevThankYou = () => {
        setShowRevThankYou(true);
    };

    /**
     * Toggles the high contrast theme.
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
                            <div>Status: {selectedOrder.status}</div>
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
            {showRevThankYou && <RevThankYou onAnimationEnd={() => setShowRevThankYou(false)} />}
        </div>
    );
};

export default OrderHistory;
