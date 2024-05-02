/**
 * React component for managing trends.
 * @returns {JSX.Element} Trends component
 */
import React, { useState } from 'react';
import './Trends.css';
import { useTextSize } from '../components/TextSizeContext';
import ManagerTopBar from '../components/ManagerTopBar';
import { useNavigate } from 'react-router-dom';

function Trends() {
    /**
     * Hook for navigation.
     * @type {Function}
     */
    const navigate = useNavigate();

    /**
     * Hook for managing text size.
     * @type {Object}
     */
    const { textSize } = useTextSize();

    /**
     * State variable for high contrast mode.
     * @type {boolean} Boolean representing high contrast mode and a function to update it
     */
    const [highContrast, setHighContrast] = useState(false);

    /**
     * Toggles high contrast mode.
     */
    const toggleHighContrast = () => {
        setHighContrast(!highContrast);
    };

    return (
        <div className={`trends ${textSize === 'large' ? 'large-text' : ''} ${highContrast ? 'high-contrast' : ''}`}>
            <ManagerTopBar toggleHighContrast={toggleHighContrast} />
            <div className='manager-trends'>
                <div className="trendsTitle">
                    <h2>Trends</h2>
                </div>
                <div className="trend-buttons">
                    <button className="trends-button" onClick={() => navigate('/manager/trends/productusage')}>
                        Generate Product Usage
                    </button>
                    <button className="trends-button" onClick={() => navigate('/manager/trends/sales')}>
                        Generate Sales Report
                    </button>
                    <button className="trends-button" onClick={() => navigate('/manager/trends/excess')}>
                        Generate Excess Report
                    </button>
                    <button className="trends-button" onClick={() => navigate('/manager/trends/restock')}>
                        Generate Restock Report
                    </button>
                    <button className="trends-button" onClick={() => navigate('/manager/trends/ordertrend')}>
                        Generate Order Trend Report
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Trends;
