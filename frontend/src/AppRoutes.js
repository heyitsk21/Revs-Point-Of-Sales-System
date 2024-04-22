import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
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
import { UserContext } from './UserContext';

function AppRoutes() {
  const { authority } = useContext(UserContext);

  return (
    <Routes>
      <Route path="/" element={<LoginScreen />} />

      <Route
        path="/manager"
        element={
          authority >= 3 ? (
            <ManagerHome />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/inventory"
        element={
          authority >= 3 ? (
            <Inventory />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/menuitems"
        element={
          authority >= 3 ? (
            <MenuItems />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/orderhistory"
        element={
          authority >= 3 ? (
            <OrderHistory />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends"
        element={
          authority >= 3 ? (
            <Trends />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/sales"
        element={
          authority >= 3 ? (
            <SalesReport />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/productusage"
        element={
          authority >= 3 ? (
            <ProdUsage />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/excess"
        element={
          authority >= 3 ? (
            <ExcessReport />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/restock"
        element={
          authority >= 3 ? (
            <RestockReport />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />
      <Route
        path="/manager/trends/ordertrend"
        element={
          authority >= 3 ? (
            <OrderTrend />
          ) : (
            <Navigate to="/unauthorized" replace />
          )
        }
      />

      <Route path="/employee" 
        element={
          authority >= 2 ? (
            <Employee />
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
