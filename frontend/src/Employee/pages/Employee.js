import React, { useState } from 'react';
import './Employee.css';
import Ordering from '../components/Ordering/Ordering';
import EmployeeTopBar from '../../components/EmployeeTopBar';
import { useTextSize } from '../../components/TextSizeContext';
import { CartProvider } from 'react-use-cart';

const Employee = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    const [highContrast, setHighContrast] = useState(false);

    const toggleHighContrast = () => {
        setHighContrast(prevState => !prevState);
    };

    return (
        <div className={`employee ${textSize === 'large' ? 'large-text' : ''} ${highContrast ? 'high-contrast' : ''}`}>
            <CartProvider>
                <EmployeeTopBar toggleHighContrast={toggleHighContrast} />
                <Ordering />
            </CartProvider>
        </div>
    );
};

export default Employee;
