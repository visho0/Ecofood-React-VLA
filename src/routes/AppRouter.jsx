import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Home from "../pages/Home";
import ProtectedRoute from "./ProtectedRoute";
import RecuperarContraseña from "../pages/RecuperarContraseña";
import ProtectedByRole from "./ProtectedByRole";

//Cliente
import ClienteDashboard from '../pages/cliente/ClienteDashboard';

//Admin
import AdminLayout from '../components/admin/layout/AdminLayout'; 
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminProductos from '../pages/admin/AdminProductos';
import AdminUsuarios from '../pages/admin/AdminUsuarios';
import AdminClientes from '../pages/admin/AdminClientes';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Login />} />
      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/registro" element={<Register />} />

      <Route path="/home" element={
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      }/>

      <Route path="/cliente/dashboard" element={
        <ProtectedByRole allowed={["cliente"]}>
          <ClienteDashboard />
        </ProtectedByRole>
      }/>

      <Route path="/admin" element={
        <ProtectedByRole allowed={["admin"]}>
          <AdminLayout />
        </ProtectedByRole>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="productos" element={<AdminProductos />} />
        <Route path="usuarios" element={<AdminUsuarios />} />
        <Route path="clientes" element={<AdminClientes />} />
      </Route>

    </Routes>
  );
}