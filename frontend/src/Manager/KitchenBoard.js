import React, { useState, useEffect } from 'react';
import ManagerTopBar from '../components/ManagerTopBar';
import Translate from '../components/translate';
import { TextSizeProvider } from '../components/TextSizeContext';
import axios from 'axios';
import './Manager.css';
import './KitchenBoard.css';

function KitchenBoard() {
    const completeOrder = async (id) =>{
        const payload = {
            orderid:id
        };
        await axios.post('http://127.0.0.1:5000/api/kitchen/completeorder', payload);
        fetchOrders();
    };

    const [orders, setOrders] = useState([]);

    const fetchOrders = async () => {
        try {
            const response = await axios.get('http://127.0.0.1:5000/api/kitchen/getinprogressorders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching inventory:', error);
        }
    };
    const data = [
        {
            "orderid": 10,
            "customername": "Damion",
            "menuitems": [
                {
                    "menuitemname": "Chicken Sandwhich",
                    "customizations": ["Lettuce", "tomato"]
                },
                {
                    "menuitemname": "Aggie Chicken Club",
                    "customizations": ["Lettuce"]
                },
                {
                    "menuitemname": "water bottle"
                }
            ]
        },
        {
            "orderid": 11,
            "customername": "John",
            "menuitems": [
                {
                    "menuitemname": "Burger",
                    "customizations": ["Lettuce", "tomato"]
                },
                {
                    "menuitemname": "water bottle"
                }
            ]
        }
    ];

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <TextSizeProvider>
        <ManagerTopBar />
            <div className="kitchen-board-container">

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
                                                    <text key={index}>+ {customization}<br></br></text>
                                
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
