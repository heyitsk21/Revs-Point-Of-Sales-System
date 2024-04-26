import React from 'react';
import './RevThankYou.css';
import revLogo from './rev.png';

const RevThankYou = ({ onAnimationEnd }) => {
    return (
        <div className="animated-dogs" onAnimationEnd={onAnimationEnd}>
            <div className="rev-container">
                <img src={revLogo} alt="Reveille" className="dog-image-rev" />
            </div>
            <div className="thank-you-container">
                <div className="thank-you">THANK YOU</div>
            </div>
            <div className="rev-container">
                <img src={revLogo} alt="Reveille" className="dog-image-rev flipped" />
            </div>
        </div>
    );
};

export default RevThankYou;
