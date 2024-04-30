import React from 'react';
import ConfirmSubmit from '../ConfirmSubmit/ConfirmSubmit';
import ConfirmClearOrder from '../ConfirmClearOrder/ConfirmClearOrder';
import { useCart } from 'react-use-cart';
import { useState } from 'react'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import './CustCart.css';


const CustCart = () => {
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

    const handleConfirmSubmit = () => {
        const data = {
            items: items.map((item, index) => ({ 
                id: item.id, 
                quantity: item.quantity, 
                name: item.name, 
                price: item.price
            }))
        };
        console.log('Data passed to ConfirmSubmit: ', data);
        setSubmitPopup(data);
    };

    return (
        <section className='customer-section'>
            <h1>Your Cart</h1>
            <div className='customer-cart'>
                <div className='customer-cartTitle'></div>
                {isEmpty ? (
                    <div className='emptyMessage'>Your Cart is Empty</div>
                ) : (
                    <>
                        {items.map((item, index) => (
                            <details key={index}>
                                <summary>
                                    <h3>
                                        <div><strong>{item.name}</strong></div>
                                        <div><small>${(item.quantity * item.price).toFixed(2)}</small></div>
                                        <div><u>Modify</u></div>
                                    </h3>
                                </summary>
                                <div className='customer-adjust'>
                                    <div className="changeQuantity">
                                        <button className="cart-button" onClick={() => updateItemQuantity(item.id, item.quantity - 1)} disabled={item.quantity === 1}>-</button>
                                        <span>{item.quantity}</span>
                                        <button className="cart-button" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                    </div>
                                    <div className="removeItem">
                                        <button className="cart-button" onClick={() => removeItem(item.id)}>Remove Item</button>
                                    </div>
                                </div>
                            </details>
                        ))}
                    </>
                )}
                <div colSpan="2">Total Price: </div>
                <div colSpan="2">${cartTotal.toFixed(2)}</div>
                <button className="cart-button" onClick={() => setClearOrderPopup(true)} disabled={cartTotal === 0}>Clear Order</button>
                <button className="cart-button" onClick={handleConfirmSubmit} disabled={cartTotal === 0}>Buy Now</button>
            </div>
            <ConfirmClearOrder trigger={clearOrderPopup} setTrigger={setClearOrderPopup} emptyCart={emptyCart} >
                <h3>Are you sure you want to cancel your order?</h3>
            </ConfirmClearOrder>
            <ConfirmSubmit trigger={submitPopup} setTrigger={setSubmitPopup} emptyCart={emptyCart} >
                <h3>Would you like to order now?</h3>
            </ConfirmSubmit>
        </section>
    
    );
}

export default CustCart;
        