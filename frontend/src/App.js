import React, { useState } from 'react';
import './App.css';

import ManagerTab from './Manager/ManagerTab';
import Inventory from './Manager/Inventory';
import Trends from './Manager/Trends';
import MenuItems from './Manager/MenuItems';
import OrderHistory from './Manager/OrderHistory';
import ProdUsage from './Manager/ProdUsage';
import SalesReport from './Manager/SalesReport';
import ExcessReport from './Manager/ExcessReport';
import RestockReport from './Manager/RestockReport';
import OrderTrend from './Manager/OrderTrend';

import Employee from './Employee/Employee';
import { TextSizeProvider } from './TextSizeContext';

function App() {
    //const [page, setPage] = useState('manager');
    const [page, setPage] = useState('employee');

    const handleNavigation = (pageName) => {
        setPage(pageName);
    };

    let currentPage;
    switch (page) {
        case 'employee':
            currentPage = <Employee onPageChange={handleNavigation} />;
            break;
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
