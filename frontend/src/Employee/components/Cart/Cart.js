import React from 'react';
import ConfirmSubmit from '../ConfirmSubmit/ConfirmSubmit';
import ConfirmClearOrder from '../ConfirmClearOrder/ConfirmClearOrder';
import './Cart.css';
import { useCart } from 'react-use-cart';
import { useState } from 'react'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

const Cart = () => {
    const { 
        isEmpty,
        items,
        cartTotal,
        updateItemQuantity,
        removeItem,
        emptyCart,
    } = useCart();

    const [submitPopup, setSubmitPopup] = useState(false);
    const [clearOrderPopup, setClearOrderPopup] = useState(false);
    const [customizationPopup, setCustomizationPopup] = useState(false);

    const handleConfirmSubmit = () => {
        const data = {
            items: items.map(item => ({ id: item.id, quantity: item.quantity }))
        };
        setSubmitPopup(data);
    };

    return (
        <div className='cart'>
            <div className='cartTitle'>
                Cart 
            </div>
            {isEmpty ? (
                <div className ='emptyMessage'>Your Cart is Empty</div>
            ) : (
                <div>
                <SimpleBar style={{ height: 400, width: '100%'}}>
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Item</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Adjust</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index)=> (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>${(item.quantity * item.price).toFixed(2)}</td>
                                    <td className='quantity'>{item.quantity}</td>
                                    <td className='adjust'>
                                        <div className = "changeQuantity">
                                            <button className="minus" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                                            <button className="plus" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                        </div>
                                        <div className = "removeItem">
                                            <button className="delete" onClick={() => removeItem(item.id)}>Remove Item</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </SimpleBar>
                    <table className='cartFooter'>
                        <tfoot>
                            <tr>
                                <td colSpan="2">Total Price:</td>
                                <td colSpan="2">${cartTotal.toFixed(2)}</td>
                            </tr>
                            <tr>
                                <td colSpan="2">
                                    <button onClick={() => setClearOrderPopup(true)}>Clear Order</button>
                                </td>
                                <td colSpan="2">
                                    <button onClick={handleConfirmSubmit}>Customize & Buy Now</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            <ConfirmClearOrder trigger={clearOrderPopup} setTrigger={setClearOrderPopup} emptyCart={emptyCart}>
                <h3>Are you sure you want to cancel your order?</h3>
            </ConfirmClearOrder>
            <ConfirmSubmit trigger = {submitPopup} setTrigger = {setSubmitPopup} emptyCart = {emptyCart}>
            </ConfirmSubmit>
        </div>
    );
};

export default Cart;