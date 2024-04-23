import React, { useState, useEffect } from 'react';
import './Manager.css';
import { useTextSize } from '../components/TextSizeContext';
import axios from 'axios';
import ManagerTopBar from '../components/ManagerTopBar';
import ManagerBottomBar from '../components/ManagerBottomBar';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [speakEnabled, setSpeakEnabled] = useState(false); // State to track if Speak is clicked
    const { textSize } = useTextSize();

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
        const speechSynthesis = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        speechSynthesis.speak(utterance);
    };

    /*
    useEffect(() => {
<<<<<<< HEAD
        // Conditionally speak only when speakEnabled is true
        if (speakEnabled) {
            speakText("Login and Time, top left. Login button, top middle. Accessibility buttons like speak and toggle, top right. Order Details, Middle. All Order History below this. Trends, bottom left. Inventory, bottom left middle. Menu Items, bottom right middle. Order History, bottom right.");
        }
    }, [speakEnabled]); // Listen for changes in speakEnabled state
=======
        speakText("Login and Time, top left. Login button, top middle. Accessibility buttons like speak and toggle, top right. Order Details, Middle. All Order History below this. Trends, bottom left. Inventory, bottom left middle. Menu Items, bottom right middle. Order History, bottom right.");
    }, []);
    */
>>>>>>> 9958fde3687734a1eaf50459099da3f4c88941b5

    return (
        <div className={`order-manager ${textSize === 'large' ? 'large-text' : ''}`}>
            <ManagerTopBar onSpeakClick={() => setSpeakEnabled(true)} /> {/* Pass onSpeakClick callback */}
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
            <div className='order-history'>
                <div className="order-list">
                    <h2>Order History</h2>
                    {renderOrderItems()}
                </div>
            </div>
            <ManagerBottomBar />
        </div>
    );
};

export default OrderHistory;
