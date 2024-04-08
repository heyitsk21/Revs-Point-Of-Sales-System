import React from 'react';
import { useCart } from 'react-use-cart';

const Cart = () => {
    const { 
        isEmpty,
        totalUniqueItems,
        items,
        totalItems, 
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
                            <td>{item.quantity}</td>
                            <td>
                                <button className="minus" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                                <button className="plus" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                <button className="delete" onClick={() => removeItem(item.id)}>Remove Item</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
                <tfoot>
                    <tr>
                        <td>Total Price:</td>
                        <td>${cartTotal.toFixed(2)}</td>
                        <td>
                            <button onClick={() => emptyCart()}>Clear Order</button>
                        </td>
                        <td>
                            <button onClick={() => emptyCart()}>Buy Now</button>
                        </td>
                    </tr>
                </tfoot>
            </table>
        )}</div>
    );
};

export default Cart;