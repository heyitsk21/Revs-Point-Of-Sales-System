/**
 * Component for scrolling menu items horizontally.
 * @param {Object} props - The props object containing the menuGroups array.
 * @returns {JSX.Element} The JSX element representing the scrolling menu items.
 */
import './MenuItemScroll.css';
import React, { useEffect, useRef } from 'react';

const MenuItemScroll = ({ menuGroups }) => {
    const scrollRef = useRef(null);

    /**
     * Effect hook to handle the horizontal scrolling animation.
     */
    useEffect(() => {
        /**
         * Function to animate the horizontal scrolling of menu items.
         */
        const marqueeAnimation = () => {
            if (scrollRef.current) {
                const scrollWidth = scrollRef.current.scrollWidth;
                const clientWidth = scrollRef.current.clientWidth;
                const maxScrollLeft = scrollWidth - clientWidth;
                let scrollAmount = scrollRef.current.scrollLeft;
                const step = 2;
                if (scrollAmount >= maxScrollLeft) {
                    scrollAmount = 0;
                } else {
                    scrollAmount += step;
                }
                scrollRef.current.scrollLeft = scrollAmount;
            }
            requestAnimationFrame(marqueeAnimation);
        };

        const animationId = requestAnimationFrame(marqueeAnimation);
        return () => cancelAnimationFrame(animationId);
    }, [menuGroups]);

    return (
        <div className="menu-item-scroll" ref={scrollRef}>
            <div className="menu-item-scroll-content">
                {menuGroups.map(group =>
                    group.items.map(item => (
                        <div key={item.menuid} className="menu-item-scroll-item">
                            <img src={item.picturepath || '/default_tamu_dining_logo.jpg'} alt={item.itemname} />
                            <div>{item.itemname}</div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MenuItemScroll;
