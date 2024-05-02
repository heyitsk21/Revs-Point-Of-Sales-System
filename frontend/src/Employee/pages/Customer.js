import React, { useState } from 'react';
import './Customer.css';
import CustOrdering from '../components/Ordering/CustOrdering';
import CustHeader from '../components/CustHeader/CustHeader';
import { useTextSize } from '../../components/TextSizeContext';
import { CartProvider } from 'react-use-cart';

/**
 * Component for customer interface.
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
                <CustHeader toggleHighContrast={toggleHighContrast} />
                <CustOrdering />
            </CartProvider>
        </div>
    );
};

export default Employee;
