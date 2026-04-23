import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import AuditPage from "../pages/AuditPage";
import CreateUserPage from "../pages/CreateUserPage";
import EditUserPage from "../pages/EditUserPage";
import HomePage from "../pages/HomePage";
import InventoryPage from "../pages/InventoryPage";
import LoginPage from "../pages/LoginPage";
import UsersPage from "../pages/UsersPage";
import AdjustInventoryPage from "../pages/AdjustInventoryPage";
import CreateProductPage from "../pages/CreateProductPage";
import EditProductPage from "../pages/EditProductPage";
import EntryPage from "../pages/EntryPage";
import ExitPage from "../pages/ExitPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/users" element={<UsersPage />} />
          <Route path="/users/new" element={<CreateUserPage />} />
          <Route path="/users/:id/edit" element={<EditUserPage />} />
          <Route path="/audit" element={<AuditPage />} />
          <Route path="/inventory" element={<InventoryPage />} />
          <Route path="/inventory/new" element={<CreateProductPage />} />
          <Route path="/inventory/:id/edit" element={<EditProductPage />} />
          <Route path="/inventory/entry" element={<EntryPage />} />
          <Route path="/inventory/exit" element={<ExitPage />} />
          <Route path="/inventory/:id/adjust" element={<AdjustInventoryPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}