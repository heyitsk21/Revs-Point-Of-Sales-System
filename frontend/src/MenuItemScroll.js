import './MenuItemScroll.css';
import React, { useEffect, useRef } from 'react';

const MenuItemScroll = ({ menuGroups }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        const scrollWidth = scrollRef.current.scrollWidth;
        const clientWidth = scrollRef.current.clientWidth;
        const maxScrollLeft = scrollWidth - clientWidth;

        let scrollAmount = 0;
        const step = 5;
        const marqueeAnimation = () => {
            scrollAmount += step;
            if (scrollAmount < maxScrollLeft) {
                scrollRef.current.scrollLeft = scrollAmount;
            } else {
                scrollRef.current.scrollLeft = 0;
                scrollAmount = 0;
            }
            requestAnimationFrame(marqueeAnimation);
        };

        marqueeAnimation();
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
