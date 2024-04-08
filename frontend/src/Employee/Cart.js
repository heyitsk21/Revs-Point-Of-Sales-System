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
                Unique Items: ({totalUniqueItems}) Total Items: ({totalItems})
            </div>
        </div>
    );
};

export default Cart;