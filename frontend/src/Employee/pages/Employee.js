import React, { useState, useEffect, useCallback } from 'react';
import './Employee.css';
import Ordering from '../components/Ordering/Ordering';
import EmployeeTopBar from '../../components/EmployeeTopBar'
import { useTextSize } from '../../components/TextSizeContext';
import { CartProvider } from 'react-use-cart';

const Employee = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    
    return (
        <div className={`employee ${textSize === 'large' ? 'large-text' : ''}`}>
            <CartProvider>
                <EmployeeTopBar/>
                <Ordering/>
            </CartProvider>
        </div>
    );
};

export default Employee;
