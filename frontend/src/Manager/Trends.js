import React from 'react';
import './Trends.css';
import { useTextSize } from '../components/TextSizeContext';
import ManagerTopBar from '../components/ManagerTopBar';
import { useNavigate } from 'react-router-dom';

function Trends() {
    const navigate = useNavigate();
    const { textSize } = useTextSize();

    return (
        <div className={`trends ${textSize === 'large' ? 'large-text' : ''}`}>
            <ManagerTopBar />
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
