import React, { useState, useEffect, useRef } from 'react';
import './Manager.css';
import { useTextSize } from '../components/TextSizeContext';
import axios from 'axios';
import ManagerTopBar from '../components/ManagerTopBar';
import ManagerBottomBar from '../components/ManagerBottomBar';
import RevThankYou from '../components/RevThankYou';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showRevThankYou, setShowRevThankYou] = useState(false);
    const { textSize } = useTextSize();
    const searchInputRef = useRef(null);

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

    const handleOrderClick = (order) => {
        setSelectedOrder(order);
    };

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

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        return date.toLocaleString();
    };

    const handleSearch = () => {
        const searchText = searchInputRef.current.value;
        window.find(searchText);
    };

    const handleShowRevThankYou = () => {
        setShowRevThankYou(true);
    };

    return (
        <div className={`order-manager ${textSize === 'large' ? 'large-text' : ''}`}>
            <ManagerTopBar />
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
                    <input type="text" placeholder="Search..." ref={searchInputRef} />
                    <button onClick={handleSearch}>Search</button>
                </div>
                <div className="order-list">
                    <h2>Order History</h2>
                    {renderOrderItems()}
                </div>
            </div>
            <ManagerBottomBar />
            {showRevThankYou && <RevThankYou onAnimationEnd={() => setShowRevThankYou(false)} />} {/* Pass onAnimationEnd event to handle reset */}
        </div>
    );
};

export default OrderHistory;
