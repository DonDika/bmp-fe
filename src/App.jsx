import React from "react";
import { Routes, Route, Navigate } from "react-router";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import UsersPage from "./pages/UsersPage";
import LocationsPage from "./pages/LocationsPage";
import ItemsPage from "./pages/ItemsPage";
import WarehousesPage from "./pages/WarehousesPage";
import WarehouseDetailPage from "./pages/WarehouseDetailPage";
import PurchasesPage from "./pages/PurchasesPage";
import SlepPage from "./pages/SlepPage";
import AuthVerifyToken from "./middleware/AuthVerifyToken";


const App = () => {
  return (
    <div>
      <AuthVerifyToken />
      <Routes>
        <Route path="/" element={<Navigate to="/auth/login" />} />
        <Route path="/auth/login" element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/dashboard/users" element={<UsersPage />} />
        <Route path="/dashboard/locations" element={<LocationsPage />} />
        <Route path="/dashboard/items" element={<ItemsPage />} />
        <Route path="/dashboard/warehouses" element={<WarehousesPage />} />
        <Route path="/dashboard/warehouses/:id" element={<WarehouseDetailPage />} />
        <Route path="/dashboard/purchases" element={<PurchasesPage />} />
        <Route path="/dashboard/slep" element={<SlepPage />} />
      </Routes>
    </div>
  );
};

export default App;
