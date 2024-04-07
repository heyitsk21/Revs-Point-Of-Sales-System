import React, { useState } from 'react';
import './ManagerTab.css';
import { useTextSize } from './components/TextSizeContext';
import ManagerTopBar from './components/ManagerTopBar';
import ManagerBottomBar from './components/ManagerBottomBar';
import GoogleTranslate from './components/translate';

const ManagerTab = ({ onPageChange }) => {
    const { textSize } = useTextSize();
    const [speakEnabled] = useState(false);

    const speakText = (text) => {
        const utterance = new SpeechSynthesisUtterance();
        utterance.text = text;
        window.speechSynthesis.speak(utterance);
    };

    const handleMouseOver = (text) => {
        if (speakEnabled) {
            setTimeout(() => {
                speakText(text);
            }, 1000); // 1-second delay
        }
    };

    const handleMenuBoardClick = () => {
        onPageChange('MenuBoard');
    };

    return (
        <div className={`manager-tab ${textSize === 'large' ? 'large-text' : ''}`}>
            <ManagerTopBar/>
            <GoogleTranslate/>
            <div className="middle-content">
                <h1 onMouseOver={() => handleMouseOver('Manager header')}>MANAGER</h1>
            </div>
            <div className="menu-board-button-container">
                <button className="menu-board-button" onClick={handleMenuBoardClick}>Menu Board</button>
            </div>
            <ManagerBottomBar onPageChange={onPageChange} />
        </div>
    );
};

export default ManagerTab;
