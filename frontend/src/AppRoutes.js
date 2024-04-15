import React from 'react';
import { Routes, Route } from 'react-router-dom';
import App from './App';
import Employee from './Employee/pages/Employee';
import Customer from './Employee/pages/Customer';
import LoginScreen from './LoginScreen';
import Inventory from './Manager/Inventory';
import MenuItems from './Manager/MenuItems';
import OrderHistory from './Manager/OrderHistory';
import Trends from './Manager/Trends';
import SalesReport from './Manager/Reports/SalesReport';
import ProdUsage from './Manager/Reports/ProdUsage';
import ExcessReport from './Manager/Reports/ExcessReport';
import RestockReport from './Manager/Reports/RestockReport';
import OrderTrend from './Manager/Reports/OrderTrend';
import ManagerHome from './Manager/ManagerHome'
import MenuBoard from './MenuBoard';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />

      <Route path="/manager" element={<ManagerHome />} />
      <Route path="/manager/inventory" element={<Inventory />} />
      <Route path="/manager/menuitems" element={<MenuItems />} />
      <Route path="/manager/orderhistory" element={<OrderHistory />} />
      <Route path="/manager/trends" element={<Trends />} />
      <Route path="/manager/trends/sales" element={<SalesReport />} />
      <Route path="/manager/trends/productusage" element={<ProdUsage />} />
      <Route path="/manager/trends/excess" element={<ExcessReport />} />
      <Route path="/manager/trends/restock" element={<RestockReport />} />
      <Route path="/manager/trends/ordertrend" element={<OrderTrend />} />

      <Route path="/employee" element={<Employee />} />
      <Route path="/menuboard" element={<MenuBoard />} />
      <Route path="/customer" element={<Customer />} />
    </Routes>
  );
}

export default AppRoutes;
