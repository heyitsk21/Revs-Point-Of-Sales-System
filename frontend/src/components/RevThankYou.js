import React from 'react';
import './RevThankYou.css';
import revLogo from './rev.png';

/**
 * Functional component representing a thank you animation with a dog image.
 * @param {Function} onAnimationEnd - Callback function to execute when the animation ends.
 * @returns {JSX.Element} - The JSX element representing the thank you animation.
 */
const RevThankYou = ({ onAnimationEnd }) => {
    return (
        <div className="animated-dogs" onAnimationEnd={onAnimationEnd}>
            {/* Container for the first dog image */}
            <div className="rev-container">
                <img src={revLogo} alt="Reveille" className="dog-image-rev" />
            </div>
            {/* Container for the thank you message */}
            <div className="thank-you-container">
                <div className="thank-you">THANK YOU</div>
            </div>
            {/* Container for the second dog image (flipped) */}
            <div className="rev-container">
                <img src={revLogo} alt="Reveille" className="dog-image-rev flipped" />
            </div>
        </div>
    );
};

export default RevThankYou;
