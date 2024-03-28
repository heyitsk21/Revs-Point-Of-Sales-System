import React, { useState } from 'react';
import './App.css';
import ManagerTab from './ManagerTab';
import Inventory from './Inventory';
import Trends from './Trends';
import MenuItems from './MenuItems';
import OrderHistory from './OrderHistory';
import ProdUsage from './ProdUsage';
import SalesReport from './SalesReport';
import ExcessReport from './ExcessReport';
import RestockReport from './RestockReport';
import OrderTrend from './OrderTrend';
import { TextSizeProvider } from './TextSizeContext';

function App() {
    const [page, setPage] = useState('manager');

    const handleNavigation = (pageName) => {
        setPage(pageName);
    };

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
            <TextSizeProvider>
                {currentPage}
            </TextSizeProvider>
        </div>
    );
}

export default App;
