/**
 * Kitchen Board Component.
 * @module KitchenBoard
 * @component
 * @example
 * return <KitchenBoard />
 */
import React, { useState, useEffect } from 'react';
import ManagerTopBar from '../components/ManagerTopBar';
import Translate from '../components/translate';
import { TextSizeProvider } from '../components/TextSizeContext';
import axios from 'axios';
import './Manager.css';
import './KitchenBoard.css';

/**
 * Kitchen Board functional component.
 * @returns {JSX.Element} Kitchen Board component
 */
function KitchenBoard() {
    /**
     * Completes the order with the specified ID.
     * @param {number} id - The ID of the order to complete
     */
    const completeOrder = async (id) =>{
        const payload = {
            orderid:id
        };
        await axios.post('https://team21revsbackend.onrender.com/api/kitchen/completeorder', payload);
        fetchOrders();
    };

    const [orders, setOrders] = useState([]);
    const [highContrast, setHighContrast] = useState(false);

    /**
     * Fetches the orders from the API.
     */
    const fetchOrders = async () => {
        try {
            const response = await axios.get('https://team21revsbackend.onrender.com/api/kitchen/getinprogressorders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };

    /**
     * Toggles the high contrast mode.
     */
    const toggleHighContrast = () => {
        setHighContrast(prevState => !prevState);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <TextSizeProvider>
            <ManagerTopBar toggleHighContrast={toggleHighContrast} highContrast={highContrast} />
            <div className={`kitchen-board-container ${highContrast ? 'high-contrast' : ''}`}>
                <Translate />
                <div className="orders-grid">
                    {orders.map(order => (
                        <div key={order.orderid} className="order-card">
                            <h3>Order ID: {order.orderid}</h3>
                            <p>Name: {order.customername}</p>
                            <ul>
                                {order.menuitems.map(item => (
                                    <li key={item.menuitemname}>
                                        {item.menuitemname}
                                        {item.customizations && item.customizations.length > 0 && (
                                            <ul>

                                                {item.customizations.map((customization, index) => (
                                                    <text key={index}>+{customization}<br></br></text>
                                
                                                ))}
                                            </ul>
                                        )}
                                    </li>
                                ))}
                            </ul>
                            <button onClick={() => completeOrder(order.orderid)}>Complete Order</button>
                        </div>
                    ))}
                </div>
            </div>
        </TextSizeProvider>
    );
}

export default KitchenBoard;
