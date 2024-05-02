/**
 * Component that defines the application routes.
 * @returns {JSX.Element} The component defining application routes
 */
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import MenuBoard from './MenuBoard';
import KitchenBoard from './Manager/KitchenBoard'
import EmployeeManagement from './Manager/EmployeeManagement';

function AppRoutes() {

  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />

      <Route
        path="/manager"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <Navigate to="/manager/trends" replace />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      <Route
        path="/manager/inventory"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <Inventory />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/menuitems"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <MenuItems />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/orderhistory"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <OrderHistory />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <Trends />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/sales"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <SalesReport />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/productusage"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <ProdUsage />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/excess"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <ExcessReport />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/restock"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <RestockReport />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/ordertrend"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <OrderTrend />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/employeemanagement"
        element={
          localStorage.getItem('authority') >= 3 ? (
            <EmployeeManagement />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      <Route path="/employee" 
        element={
          localStorage.getItem('authority') >= 2 ? (
            <Employee />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      <Route path="/kitchen"
        element={
          localStorage.getItem('authority') >= 2 ? (
            <KitchenBoard />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      <Route path="/menuboard" element={<MenuBoard />} />
      <Route path="/customer" element={<Customer />} />

      <Route path="/unauthorized" element={<div>Unauthorized Access</div>} />
    </Routes>
  );
}

export default AppRoutes;
