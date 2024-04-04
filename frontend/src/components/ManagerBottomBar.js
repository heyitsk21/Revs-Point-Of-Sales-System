
import React, {useState}from 'react';


const ManagerBottomBar = ({onPageChange}) => {
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




    return(            
    <div className="bottom-nav">
    <button onMouseOver={() => handleMouseOver("Trends")} onClick={() => onPageChange('trends')}>Trends</button>
    <button onMouseOver={() => handleMouseOver("Inventory")} onClick={() => onPageChange('inventory')}>Inventory</button>
    <button onMouseOver={() => handleMouseOver("Menu Items")} onClick={() => onPageChange('menuItems')}>Menu Items</button>
    <button onMouseOver={() => handleMouseOver("Order History")} onClick={() => onPageChange('orderHistory')}>Order History</button>
</div>
);
};

export default ManagerBottomBar;