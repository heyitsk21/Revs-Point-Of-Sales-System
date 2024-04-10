import React from 'react';
import './Cart.css';
import { useCart } from 'react-use-cart';

const Cart = () => {
    const { 
        isEmpty,
        items,
        cartTotal,
        updateItemQuantity,
        removeItem,
        emptyCart,
    } = useCart();

    console.log('Cart Items:', items);

    return (
        <div className='cart'>
            <div className='cartTitle'>
                Cart 
            </div>
            {isEmpty ? (<div className ='emptyMessage'>Your Cart is Empty</div>
            ) : (
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
                <tfoot>
                    <tr>
                        <td colSpan="2">Total Price:</td>
                        <td colSpan="2">${cartTotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colSpan="2">
                            <button onClick={() => emptyCart()}>Clear Order</button>
                        </td>
                        <td colSpan="2">
                            <button onClick={() => emptyCart()}>Buy Now</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        )}</div>
    );
};

export default Cart;