import React, { useState, useEffect, useCallback } from 'react';
import './Employee.css';
import Ordering from '../components/Ordering/Ordering';
import EmpHeader from '../components/EmpHeader/EmpHeader'
import CustHeader from '../components/CustHeader/CustHeader'
import { useTextSize } from '../../TextSizeContext';
const Employee = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    
    return (
        <div className={`employee ${textSize === 'large' ? 'large-text' : ''}`}>
            <EmpHeader/>
            <Ordering/>
        </div>
    );
};

export default Employee;
