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

    if(isEmpty) return <div>Your Cart is Empty</div>

    return (
        <div>
            <div className='cartTitle'>
                Cart 
            </div>
            <div className='cart'>
                <table className="table">
                    <tbody>
                        {items.map((item, index)=> {
                            return(
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.price}</td>
                                    <td>{item.quantity}</td>
                                    <td>
                                        <button className="add" onClick={() => updateItemQuantity(item.id, item.quantity + 1)}>+</button>
                                        <button className="minus" onClick={() => updateItemQuantity(item.id, item.quantity - 1)}>-</button>
                                        <button className="delete" onClick={() => removeItem(item.id)}>Remove Item</button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Cart;