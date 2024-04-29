import React from 'react';
import ConfirmSubmit from '../ConfirmSubmit/ConfirmSubmit';
import ConfirmClearOrder from '../ConfirmClearOrder/ConfirmClearOrder';
// import './Cart.css';
// import './CustCart.css';
import { useCart } from 'react-use-cart';
import { useState } from 'react'
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';

let cust_is_open = false;
let curr_url = window.location.href;
// console.log(curr_url);
if (curr_url.substring(0,70) === 'https://project-3-full-stack-agile-web-team-21-2.onrender.com/customer' || curr_url.substring(0,30) === 'http://localhost:3000/customer') {
    import('./CustCart.css');
    cust_is_open = true;
} else {
    import('./Cart.css');
}

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

    const handleConfirmSubmit = () => {
        const data = {
            items: items.map(item => ({ id: item.id, quantity: item.quantity }))
        };
        setSubmitPopup(data);
    };

    if (!cust_is_open) {
        return (
            <div className='employee-cart'>
                <div className='employee-cartTitle'>
                    Cart 
                </div>
                {isEmpty ? (
                    <div className ='emptyMessage'>Your Cart is Empty</div>
                ) : (
                    <div>
                        <table className="employee-table">
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
                                        <td>{item.quantity}</td>
                                        <td className='adjust'>
                                            <div className = "changeQuantity">
                                                <button className="cart-button" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                                                <button className="cart-button" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                            </div>
                                            <div className = "removeItem">
                                                <button className="cart-button" onClick={() => removeItem(item.id)}>Remove Item</button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <table className='employee-table'>
                            <tfoot>
                                <tr>
                                    <td colSpan="2">Total Price:</td>
                                    <td colSpan="2">${cartTotal.toFixed(2)}</td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <button className="cart-button" onClick={() => setClearOrderPopup(true)}>Clear Order</button>
                                    </td>
                                    <td colSpan="2">
                                        <button className="cart-button" onClick={handleConfirmSubmit}>Buy Now</button>
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
                    <h3>Would you like to order now?</h3>
                </ConfirmSubmit>
            </div>
        );
    } else {
        console.log(window.location.pathname);
        return (
            <section>

                <img src='CustomerImages/logo192.png' alt='asdf'/>
                <h1>Your Cart</h1>
                <div className='employee-cart'>
                    <div className='employee-cartTitle'></div>
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
                                    <div className='adjust'>
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
}

export default Cart;
        