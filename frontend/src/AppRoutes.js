import React from 'react';
import { Routes, Route } from 'react-router-dom';
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
import ZReport from './Manager/Reports/zreport';
import XReport from './Manager/Reports/xreport';
import OrderTrend from './Manager/Reports/OrderTrend';
import MenuBoard from './MenuBoard';
import KitchenBoard from './Manager/KitchenBoard';
import EmployeeManagement from './Manager/EmployeeManagement';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />
      <Route path="/manager/inventory" element={<Inventory />} />
      <Route path="/manager/menuitems" element={<MenuItems />} />
      <Route path="/manager/orderhistory" element={<OrderHistory />} />
      <Route path="/manager/trends" element={<Trends />} />
      <Route path="/manager/trends/sales" element={<SalesReport />} />
      <Route path="/manager/trends/zreport" element={<ZReport />} />
      <Route path="/manager/trends/xreport" element={<XReport />} />
      <Route path="/manager/trends/productusage" element={<ProdUsage />} />
      <Route path="/manager/trends/excess" element={<ExcessReport />} />
      <Route path="/manager/trends/restock" element={<RestockReport />} />
      <Route path="/manager/trends/ordertrend" element={<OrderTrend />} />
      <Route path="/manager/employeemanagement" element={<EmployeeManagement />} />
      <Route path="/employee" element={<Employee />} />
      <Route path="/kitchen" element={<KitchenBoard />} />
      <Route path="/menuboard" element={<MenuBoard />} />
      <Route path="/customer" element={<Customer />} />
      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
    </Routes>
  );
}

export default AppRoutes;
