import React from 'react';
import ConfirmSubmit from '../ConfirmSubmit/ConfirmSubmit';
import ConfirmClearOrder from '../ConfirmClearOrder/ConfirmClearOrder';
import { useCart } from 'react-use-cart';
import { useState } from 'react'
//import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import './CustCart.css';
import Weather from '../../../components/Wheater';

/**
 * Customer Cart component to display and manage items in the cart.
 * @returns {JSX.Element} - The JSX element representing the Customer Cart component.
 */
const CustCart = () => {
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
            items: items.flatMap(item => 
                Array.from({ length: item.quantity }, (_, index) => ({ 
                    id: item.id, 
                    quantity: 1, 
                    name: item.name, 
                    price: item.price,
                    uniqueID: `${item.id}_${index}`
                }))
            )
        };
        console.log('Data passed to ConfirmSubmit: ', data);
        setSubmitPopup(data);
    };

    // Render the Customer Cart component
    return (
        <section className='customer-section'>
            <div className='CustCardHeader'><div className='custheader-child'><h1>Your Cart</h1></div><div className='custheader-child'><h1><Weather/></h1></div></div>
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
                <div className='customer-total'>
                    <div>Total Price: </div>
                    <div className='customer-total-price-value'>${cartTotal.toFixed(2)}</div>
                </div>
                    <button className="customer-cart-button" onClick={() => setClearOrderPopup(true)} disabled={cartTotal === 0}>Clear Order</button>
                    <button className="customer-cart-button" onClick={handleConfirmSubmit} disabled={cartTotal === 0}>Customize & Continue</button>
            </div>
            {/* Confirm clear order popup */}
            <ConfirmClearOrder trigger={clearOrderPopup} setTrigger={setClearOrderPopup} emptyCart={emptyCart} >
                <h3>Are you sure you want to cancel your order?</h3>
            </ConfirmClearOrder>
            {/* Confirm submit popup */}
            <ConfirmSubmit trigger={submitPopup} setTrigger={setSubmitPopup} emptyCart={emptyCart} >
                <h3>Would you like to order now?</h3>
            </ConfirmSubmit>
        </section>
    
    );
}

export default CustCart;
