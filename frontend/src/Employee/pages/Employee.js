import React, { useState } from 'react';
import './Employee.css';
import Ordering from '../components/Ordering/Ordering';
import EmployeeTopBar from '../../components/EmployeeTopBar';
import { useTextSize } from '../../components/TextSizeContext';
import { CartProvider } from 'react-use-cart';

/**
 * Component for employee interface.
 * @param {object} props - Props passed to the component.
 * @param {function} props.onCatChange - Function to handle category change.
 * @returns {JSX.Element} - The JSX element representing the Employee component.
 */
const Employee = ({ onCatChange }) => {
    const { textSize, toggleTextSize } = useTextSize();
    const [highContrast, setHighContrast] = useState(false);

    /**
     * Function to toggle high contrast mode.
     */
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
