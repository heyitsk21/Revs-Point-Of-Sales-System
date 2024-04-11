
import React, {useState}from 'react';
import { useNavigate  } from 'react-router-dom';
import './ManagerBottomBar.css';

function ManagerBottomBar() {
    const navigate = useNavigate();
    const [speakEnabled] = useState(false);

    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const handleMouseOver = debounce((event) => {
        let hoveredElementText = '';
        if (speakEnabled) {
            if (event.target.innerText) {
                hoveredElementText = event.target.innerText;
            } else if (event.target.value) {
                hoveredElementText = event.target.value;
            } else if (event.target.getAttribute('aria-label')) {
                hoveredElementText = event.target.getAttribute('aria-label');
            } else if (event.target.getAttribute('aria-labelledby')) {
                const id = event.target.getAttribute('aria-labelledby');
                const labelElement = document.getElementById(id);
                if (labelElement) {
                    hoveredElementText = labelElement.innerText;
                }
            }
            speakText(hoveredElementText);
        }
    }, 1000); 
    
    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    const handleButtonClick = (buttonName) => {
        // Perform actions based on which button is clicked
        switch (buttonName) {
          case 'trends':
            // Do something for Trends button
            console.log('Trends button clicked');
            navigate('/manager/trends');
            break;
          case 'inventory':
            // Do something for Inventory button
            console.log('Inventory button clicked');
            navigate('/manager/inventory');
            break;
          case 'menuItems':
            // Do something for Menu Items button
            console.log('Menu Items button clicked');
            navigate('/manager/menuitems');
            break;
          case 'orderHistory':
            // Do something for Order History button
            console.log('Order History button clicked');
            navigate('/manager/orderhistory');
            break;
          default:
            break;
        }
    };

    return(            
        <div className="bottom-nav">
            <button className="bottom-bar-button" onClick={() => handleButtonClick('trends')}>Trends</button>
            <button className="bottom-bar-button" onClick={() => handleButtonClick('inventory')}>Inventory</button>
            <button className="bottom-bar-button" onClick={() => handleButtonClick('menuItems')}>Menu Items</button>
            <button className="bottom-bar-button" onClick={() => handleButtonClick('orderHistory')}>Order History</button>
        </div>
    );
};

export default ManagerBottomBar;