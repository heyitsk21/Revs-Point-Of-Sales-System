import React from 'react';
import ConfirmSubmit from '../ConfirmSubmit/ConfirmSubmit';
import ConfirmClearOrder from '../ConfirmClearOrder/ConfirmClearOrder';
import { useCart } from 'react-use-cart';
import { useState } from 'react'
//import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import './Cart.css';

/**
 * Cart component to display and manage the items in the cart.
 * @returns {JSX.Element} - The JSX element representing the Cart component.
 */
const Cart = () => {
    // Hook to manage cart state
    const { 
        isEmpty,
        items,
        cartTotal,
        updateItemQuantity,
        removeItem,
        emptyCart,
    } = useCart();

    // State variables for submit and clear order popups
    const [submitPopup, setSubmitPopup] = useState(false);
    const [clearOrderPopup, setClearOrderPopup] = useState(false);

    /**
     * Function to handle confirm submit action.
     */
    const handleConfirmSubmit = () => {
        // Prepare data for submission
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

    // Render the Cart component
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
                                    <td className='employee-adjust'>
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
                                    <button className="cart-button" onClick={handleConfirmSubmit}>Customize & Continue</button>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Confirm clear order popup */}
            <ConfirmClearOrder trigger={clearOrderPopup} setTrigger={setClearOrderPopup} emptyCart={emptyCart}>
                <h3>Are you sure you want to cancel your order?</h3>
            </ConfirmClearOrder>

            {/* Confirm submit popup */}
            <ConfirmSubmit trigger={submitPopup} setTrigger={setSubmitPopup} emptyCart={emptyCart}>
                <h3>Would you like to order now?</h3>
            </ConfirmSubmit>
        </div>
    );
}

export default Cart;
