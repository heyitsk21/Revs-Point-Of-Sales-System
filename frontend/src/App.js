import React, { useState } from 'react';
import './App.css';
import ManagerTab from './ManagerTab';
import Inventory from './Inventory'; // Import your Inventory component
import Trends from './Trends'; // Import your Trends component
import MenuItems from './MenuItems'; // Import your MenuItems component
import OrderHistory from './OrderHistory'; // Import your OrderHistory component
import ProdUsage from './ProdUsage'; // Import your ProdUsage component
import SalesReport from './SalesReport'; // Import your SalesReport component
import ExcessReport from './ExcessReport'; // Import your ExcessReport component
import RestockReport from './RestockReport'; // Import your RestockReport component
import OrderTrend from './OrderTrend'; // Import your OrderTrend component
import { TextSizeProvider } from './TextSizeContext'; // Import TextSizeProvider

function App() {
    const [page, setPage] = useState('manager'); // State to track which page to display

    // Function to handle page navigation
    const handleNavigation = (pageName) => {
        setPage(pageName);
    };

    // Render different components based on the current page state
    let currentPage;
    switch (page) {
        case 'manager':
            currentPage = <ManagerTab onPageChange={handleNavigation} />;
            break;
        case 'inventory':
            currentPage = <Inventory onPageChange={handleNavigation} />;
            break;
        case 'trends':
            currentPage = <Trends onPageChange={handleNavigation} />;
            break;
        case 'menuItems':
            currentPage = <MenuItems onPageChange={handleNavigation} />;
            break;
        case 'orderHistory':
            currentPage = <OrderHistory onPageChange={handleNavigation} />;
            break;
        case 'prodUsage':
            currentPage = <ProdUsage onPageChange={handleNavigation} />;
            break;
        case 'salesReport':
            currentPage = <SalesReport onPageChange={handleNavigation} />;
            break;
        case 'excessReport':
            currentPage = <ExcessReport onPageChange={handleNavigation} />;
            break;
        case 'restockReport':
            currentPage = <RestockReport onPageChange={handleNavigation} />;
            break;
        case 'orderTrend':
            currentPage = <OrderTrend onPageChange={handleNavigation} />;
            break;
        default:
            currentPage = <ManagerTab onPageChange={handleNavigation} />;
    }

    return (
        <div className="App">
            {/* Wrap the entire application with TextSizeProvider */}
            <TextSizeProvider>
                {/* Render the current page */}
                {currentPage}
            </TextSizeProvider>
        </div>
    );
}

export default App;
