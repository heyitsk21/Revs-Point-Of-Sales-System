import React, { useState, useEffect, useCallback } from 'react';
import './EmpCust.css';
import Ordering from '../components/Ordering/Ordering';
import CustHeader from '../components/CustHeader/CustHeader'
import { useTextSize } from '../../TextSizeContext';
const Employee = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    
    return (
        <div className={`employee ${textSize === 'large' ? 'large-text' : ''}`}>
            <CustHeader/>
            <Ordering/>
        </div>
    );
};

export default Employee;
